!(function () {
  ("use strict");
  //Should we hydrate?
  var BreakerHydrate = window.__BreakerHydrate;
  //Private State Management Object
  var states = {};
  //Public State Management Object
  var sharedStates = {};
  //Holds reference to components functions
  var componentTypes = {};
  //Keeps data on rendering cycles
  var renderCycle = {
    on: false,
    renderingMode: false,
    register: {},
    refresh: {},
    attributes: {},
    update: {},
    newPage: {
      id: null,
      getArgs: undefined,
      isPoppedState: false,
      pageName: "",
      firstRender: false,
    },
    currentPage: null,
    unwantedComponents: [],
    states: {},
    sharedStates: {},
  };

  //This is hopefully to be used for safe writes and reads directly to and from the dom.
  var outOfScopeTasks = {
    write: [],
    read: [],
  };
  //Components are id'ed for easy access from the states object
  var componentsCount = 0;
  var componentTypesCount = 0;
  var symbolIdentifier = `$_${Math.random()}-`;
  var tempIdentifier = `$_${Math.random()}-TEMP`;
  var componentsIdentifier = symbolIdentifier + "component";

  function setFreezedObjectProperty(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
  function setNonEnumerableObjectProperty(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
  function setWritableObjectProperty(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: false,
      configurable: false,
      writable: true,
    });
  }
  function setFreezedObjectProperties(obj, propsObj) {
    var keys = Object.keys(propsObj);
    for (var i = 0; i < keys.length; i++) {
      setFreezedObjectProperty(obj, keys[i], propsObj[keys[i]]);
    }
    return obj;
  }

  var requestFrame = window.requestAnimationFrame
    ? window.requestAnimationFrame
    : function requestRenderingFrame_2(callback) {
        return setTimeout(callback, 4);
      };

  function takeArguments() {
    return arguments;
  }
  function RenderNewPage() {
    var newpage = false;
    if (renderCycle.newPage.id) {
      const pages = standAloneApps[symbolIdentifier];

      //Render new page if new page to be rendered is not the current rendered page
      if (renderCycle.newPage.id != pages.currentPage) {
        var currentPageId = pages.currentPage;
        var currentPage = states[currentPageId][symbolIdentifier].domNode;
        var currentPageParentNode = currentPage.parentNode;
        var pageExitRegisteredComponents = Object.keys(
          pages.onpageExit[currentPageId]
        );
        //OnPageExit Events
        //Execute all page exit events
        for (var i = 0; i < pageExitRegisteredComponents.length; i++) {
          pages.onpageExit[currentPageId][
            pageExitRegisteredComponents[i]
          ].apply(states[pageExitRegisteredComponents[i]]);
        }
        pages.onpageExit[currentPageId] = {};
        var pagePosition = document.createTextNode("");
        currentPageParentNode.insertBefore(pagePosition, currentPage);
        pages.visitedPages[currentPageId] = true;
        renderCycle.unwantedComponents.push(currentPageId);
        pages.currentPage = renderCycle.newPage.id;
        $Render(
          states[renderCycle.newPage.id][symbolIdentifier].ref,
          // renderCycle.newPage.getArgs(takeArguments)
          undefined
        );
        if (pagePosition.nextSibling == currentPage) {
          //The page to be discarded is not (reused in/part of) the new page to be rendered
          currentPage.replaceWith(
            states[pages.currentPage][symbolIdentifier].domNode
          );
          pagePosition.remove();
        } else {
          //The page to be discarded is (reused in/part of) the new page to be rendered
          pagePosition.replaceWith(
            states[pages.currentPage][symbolIdentifier].domNode
          );
        }
        currentPageId = renderCycle.newPage.id;

        if (renderCycle.newPage.firstRender) {
          //We scroll to the very top of the page to simulate the usuall
          //position of the screen when a new page is loaded.
          window.scrollTo({ top: 0 });
        }
        renderCycle.newPage.firstRender = undefined;
        renderCycle.newPage.id =
          currentPage =
          pagePosition =
          currentPageParentNode =
            null;
        newpage = true;
      }
      //Same component may be used to render many pages with different args/props.
      //The window location's href may need to be changed to reflect changes
      if (renderCycle.newPage.pageName != pages.currentPageName) {
        pages.currentPageName = renderCycle.newPage.pageName;
        //If the page is rendered as a result of a pop-state event,
        //the state data would be available via the `History API`
        if (!renderCycle.newPage.isPoppedState) {
          var state_data =
            typeof renderCycle.newPage.getArgs == "function"
              ? renderCycle.newPage.getArgs()
              : renderCycle.newPage.getArgs;
          history.pushState(state_data, "", pages.currentPageName);
        }
      }
      renderCycle.newPage.pageName = "";
      renderCycle.newPage.isPoppedState = false;
    }
    return newpage;
  }

  //Updates all state-changed components
  function serveQueue() {
    var next,
      i = 0;

    const stateUpdates = renderCycle.update.states;
    while (i < stateUpdates.length) {
      next = stateUpdates[i];
      $Render(states[next][symbolIdentifier].ref, symbolIdentifier);
      i++;
    }
    for (i = 0; i < outOfScopeTasks.write.length; i++) {
      outOfScopeTasks.write[i]();
    }
  }
  function lessPreferenceAttrUpdates() {
    const { components, page } = this;
    var i = 0,
      componentObject_Internal;
    while (i < components.length) {
      componentObject_Internal = states[components[i]][symbolIdentifier];
      componentObject_Internal.classChanged = false;
      componentObject_Internal.attrChanged = false;
      componentObject_Internal.styleChanged = false;
      if (componentObject_Internal.domNode) {
        attrUpdater(components[i]);
      } else if (componentObject_Internal.keyedElements) {
        destroyedAttrUpdater(components[i]);
      }
      i++;
    }
    completeBatchUpdates(page);
  }
  function styleClassAttrUpdates(
    componentsToDestroyObject,
    componentsToDestroyHeads
  ) {
    var lessPreference = [];
    var i = 0;
    var updates = renderCycle.update.attributes;
    var componentId, componentObject_Internal;
    var willDestroy;
    while (i < updates.length) {
      componentId = updates[i];
      willDestroy =
        componentsToDestroyObject[componentId] &&
        !states[componentId][symbolIdentifier].domNode.isConnected;
      if (willDestroy) {
        lessPreference.push(componentId);
      } else {
        componentObject_Internal = states[componentId][symbolIdentifier];
        componentObject_Internal.classChanged = false;
        componentObject_Internal.attrChanged = false;
        componentObject_Internal.styleChanged = false;
        attrUpdater(componentId);
      }
      i++;
    }
    setTimeout(
      destroyer.bind({
        lessPreferenceComponents: lessPreference,
        page: standAloneApps[symbolIdentifier].currentPage,
        heads: componentsToDestroyHeads,
      }),
      1
    );
  }

  function destroyer() {
    const { heads, lessPreferenceComponents, page } = this;
    var i;
    for (i in heads) {
      finalDestruction(heads[i]);
    }
    if (lessPreferenceComponents.length) {
      setTimeout(
        lessPreferenceAttrUpdates.bind({
          components: lessPreferenceComponents,
          page: page,
        }),
        0
      );
    } else {
      completeBatchUpdates(page);
    }
  }

  function attrUpdater(componentId) {
    var i = 0,
      styles,
      classNames,
      attributes,
      keyedEl,
      j;
    var keys = Object.keys(renderCycle.attributes[componentId]);
    var ups = renderCycle.attributes[componentId],
      keyedUps;
    var keyedEls = states[componentId][symbolIdentifier].keyedElements;
    var newClassNames, keyHolder, value;
    while (i < keys.length) {
      keyedEl = keyedEls[keys[i]];
      keyedUps = ups[keys[i]];
      styles = hasValuesChanged(keyedEl.styles, keyedUps.styles);
      attributes = hasValuesChanged(keyedEl.attributes, keyedUps.attributes);
      classNames = hasValuesChanged(keyedEl.classNames, keyedUps.classNames);
      if (classNames.hasChanged) {
        value = classNames.value;
        newClassNames = {};
        j = 0;
        keyHolder = Object.keys(value);
        while (j < keyHolder.length) {
          if (value[keyHolder[j]]) {
            newClassNames[keyHolder[j]] = 1;
          }
          j++;
        }
        keyedEl.classNames = newClassNames;
        keyedEl.element.setAttribute(
          "class",
          Object.keys(newClassNames).join(" ")
        );
      }
      if (styles.hasChanged) {
        keyedEl.styles = styles.value;
        setStyleAttributes(keyedEl.element, keyedUps.styles);
      }
      if (attributes.hasChanged) {
        keyedEl.attributes = attributes.value;
        keyedEl.setMethods = {
          ...keyedEl.setMethods,
          ...setElementAttributes(keyedEl.element, keyedUps.attributes),
        };
      }
      i++;
    }
  }

  function destroyedAttrUpdater(componentId) {
    var i = 0,
      keyedEl;
    var keys = Object.keys(renderCycle.attributes[componentId]);
    var ups = renderCycle.attributes[componentId],
      keyedUps;
    var keyedEls = states[componentId][symbolIdentifier].keyedElements;
    while (i < keys.length) {
      keyedEl = keyedEls[keys[i]];
      keyedUps = ups[keys[i]];
      keyedEl.styles = {
        ...keyedEl.styles,
        ...keyedUps.styles,
      };
      keyedEl.classNames = {
        ...keyedEl.classNames,
        ...keyedUps.classNames,
      };
      keyedEl.attributes = {
        ...keyedEl.attributes,
        ...keyedUps.attributes,
      };
      i++;
    }
  }
  function completeBatchUpdates(page) {
    outOfScopeTasks.write = [];
    renderCycle.on = false;
    renderCycle.renderingMode = false;
    renderCycle.register = {};
    renderCycle.refresh = {};
    renderCycle.attributes = {};
    renderCycle.update = {};
    renderCycle.states = {};
    renderCycle.sharedStates = {};
    renderCycle.unwantedComponents = [];
    clearClonableViews();
    if (standAloneApps[symbolIdentifier].visitedPages[page]) {
      var pageRerenderRegisteredComponents = Object.keys(
        standAloneApps[symbolIdentifier].onNewPage[page]
      );
      for (var i = 0; i < pageRerenderRegisteredComponents.length; i++) {
        //OnPageRerendered Events
        //This event is triggered for registered components whenever the
        //page they belong to is re-rendered. That is, a switch back to the page.
        standAloneApps[symbolIdentifier].onNewPage[page][
          pageRerenderRegisteredComponents[i]
        ].apply(states[pageRerenderRegisteredComponents[i]]);
      }
    }
    standAloneApps[symbolIdentifier].onNewPage[page] = {};

    //Run all pending updates. `setACTION()` updates that were triggered during
    //render cycle were put on pending state. Remove from pending state.
    var pendingStateChanges = PENDING_STATE_CHANGE;
    var pendingStyleChanges = PENDING_STYLE_CHANGE;
    var pendingClassChanges = PENDING_CLASS_CHANGE;
    var pendingAttrChanges = PENDING_ATTR_CHANGE;
    var pendingSharedStateChanges = PENDING_SHAREDSTATE_CHANGE;
    PENDING_STATE_CHANGE = {};
    PENDING_CLASS_CHANGE = {};
    PENDING_STYLE_CHANGE = {};
    PENDING_ATTR_CHANGE = {};
    PENDING_SHAREDSTATE_CHANGE = {};

    var keyHoder = Object.keys(pendingStateChanges),
      componentId;
    for (i = 0; i < keyHoder.length; i++) {
      componentId = keyHoder[i];
      setState(states[componentId], pendingStateChanges[componentId]);
    }

    var keys, j, componentObject, ups;
    keyHoder = Object.keys(pendingStyleChanges);
    for (i = 0; i < keyHoder.length; i++) {
      componentId = keyHoder[i];
      keys = Object.keys(pendingStyleChanges[componentId]);
      componentObject = states[componentId];
      ups = pendingStyleChanges[componentId];
      for (j = 0; j < keys.length; j++) {
        setStyle(componentObject, keys[j], ups[keys[j]]);
      }
    }
    keyHoder = Object.keys(pendingAttrChanges);
    for (i = 0; i < keyHoder.length; i++) {
      componentId = keyHoder[i];
      keys = Object.keys(pendingAttrChanges[componentId]);
      componentObject = states[componentId];
      ups = pendingAttrChanges[componentId];
      for (j = 0; j < keys.length; j++) {
        setAttribute(componentObject, keys[j], ups[keys[j]]);
      }
    }
    keyHoder = Object.keys(pendingClassChanges);
    for (i = 0; i < keyHoder.length; i++) {
      componentId = keyHoder[i];
      keys = Object.keys(pendingClassChanges[componentId]);
      componentObject = states[componentId];
      ups = pendingClassChanges[componentId];
      for (j = 0; j < keys.length; j++) {
        setClass(componentObject, keys[j], ups[keys[j]], symbolIdentifier);
      }
    }
    var RSS = renderCycle.sharedStates,
      stateId,
      stateData,
      startCycle = false;
    for (stateId in pendingSharedStateChanges) {
      stateData = pendingSharedStateChanges[stateId];
      RSS[stateId] = {
        value: stateData ? { ...stateData } : null,
        sync: 0,
      };
      startCycle = true;
    }
    if (startCycle) {
      startNewCycle();
    }
  }

  function PerformBatchUpdatingTasks() {
    //Call to check if we are supposed to render a new page
    var newpage = RenderNewPage();
    if (!newpage) {
      //Run updates for current page
      serveQueue();
    }
    var componentsToDestroy = renderCycle.unwantedComponents;
    var visitsCache = {};
    var heads = { count: -1, value: {} };
    getNestedComponents2(componentsToDestroy, visitsCache, heads);
    styleClassAttrUpdates(visitsCache, heads.value);
  }

  //Find all nested components of the given components
  function getNestedComponents2(children, obj, heads) {
    var l = children.length;
    var i = 0,
      value,
      headValue,
      currentHead;
    heads.count++;
    while (i < l) {
      value = children[i];
      i++;
      if (obj[value]) {
        headValue = heads.value;
        if (headValue[value]) {
          currentHead = heads.curr;
          headValue[currentHead] = headValue[currentHead].concat(
            headValue[value]
          );
          headValue[value] = null;
          delete headValue[value];
          headValue = currentHead = null;
        }
        continue;
      }
      if (!heads.count) {
        heads.value[value] = [value];
        heads.curr = value;
      } else {
        heads.value[heads.curr].push(value);
      }
      obj[value] = 1;
      getNestedComponents2(
        Object.values(states[value][symbolIdentifier].childComponents),
        obj,
        heads
      );
    }
    heads.count--;
  }

  //Creates a new component and asigns a state object
  function ComponentRef() {
    componentsCount++;
    var data = {};
    data[symbolIdentifier] = componentsCount;
    states[componentsCount] = setNonEnumerableObjectProperty(
      {},
      symbolIdentifier,
      {
        parent: 0,
        parentDNode: undefined,
        id: componentsCount,
        firstCall: false,
        childComponents: {},
        sharingState: [],
        isInserted: false,
        detached: false,
        dynamicNodes: [],
        domNode: null,
        objectNode: null,
        ownerPage: standAloneApps[symbolIdentifier].currentPage,
        keepNodeOnDetach: false,
        keepStateOnDetach: false,
        keepOnDetach: false,
        destroy: false,
        isDestroyed: true,
        data: data,
        classType: this[symbolIdentifier].classType,
        created: false,
        keyedElements: {},
        ref: setNonEnumerableObjectProperty(
          {},
          symbolIdentifier,
          setFreezedObjectProperties(
            {},
            {
              classType: this[symbolIdentifier].classType,
              id: componentsCount,
            }
          )
        ),
      }
    );

    data = null;

    return states[componentsCount][symbolIdentifier].ref;
  }

  function startNewCycle() {
    if (!renderCycle.on) {
      renderCycle.on = true;
      setTimeout(onUpdateEvents, 8);
    }
  }

  function onUpdateEvents() {
    requestFrame(triggerOnRerenderEvents);
  }

  function batchUpdate() {
    requestFrame(PerformBatchUpdatingTasks);
  }

  function triggerOnRerenderEvents() {
    renderCycle.renderingMode = true;
    var i = 0,
      ups = { states: {}, attributes: [] };
    var newValue, componentId, componentObject, componentObject_Internal;
    const currentPage = standAloneApps[symbolIdentifier].currentPage;
    const willRenderNewPage = renderCycle.newPage.id != currentPage;
    const cycleSharedStates = renderCycle.sharedStates;
    var stateId, sharedInfo, cycleData, grpLenth;
    for (stateId in cycleSharedStates) {
      sharedInfo = sharedStates[stateId];
      cycleData = cycleSharedStates[stateId].value;
      grpLenth = sharedInfo.group.length;
      if (sharedInfo.data) {
        if (cycleData) {
          newValue = hasValuesChanged(sharedInfo.data, cycleData);
          if (newValue.hasChanged) {
            sharedInfo.data = newValue.value;
          } else {
            continue;
          }
        } else {
          sharedInfo.data = null;
        }
        for (i = 0; i < grpLenth; i++) {
          componentId = sharedInfo.group[i];
          componentObject_Internal = states[componentId][symbolIdentifier];
          if (!componentObject_Internal.isDestroyed) {
            if (componentObject_Internal.ownerPage == currentPage) {
              ups.states[componentId] = componentId;
            }
          }
        }
      } else {
        if (cycleData) {
          sharedInfo.data = cycleData;
          for (i = 0; i < grpLenth; i++) {
            componentId = sharedInfo.group[i];
            componentObject_Internal = states[componentId][symbolIdentifier];
            if (!componentObject_Internal.isDestroyed) {
              if (componentObject_Internal.ownerPage == currentPage) {
                ups.states[componentId] = componentId;
              }
            }
          }
        }
      }
      cycleSharedStates[stateId].sync = 1;
    }

    for (i in renderCycle.states) {
      componentId = i;
      componentObject = states[componentId];
      componentObject_Internal = componentObject[symbolIdentifier];
      mustUpdate = false;
      if (typeof renderCycle.states[componentId] == "object") {
        if (!renderCycle.states[componentId]) {
          if (componentObject.state) {
            componentObject.state = null;
            if (componentObject_Internal.ownerPage == currentPage) {
              ups.states[componentId] = componentId;
              componentObject_Internal.stateSync = 1;
            }
          } else {
            componentObject_Internal.stateChanged = false;
          }
        } else {
          if (componentObject.state) {
            if (componentObject_Internal.ownerPage == currentPage) {
              newValue = hasValuesChanged(
                componentObject.state,
                renderCycle.states[componentId]
              );
              if (newValue.hasChanged) {
                componentObject.state = newValue.value;
                ups.states[componentId] = componentId;
                componentObject_Internal.stateSync = 1;
              } else {
                componentObject_Internal.stateChanged = false;
              }
            } else {
              componentObject.state = {
                ...componentObject.state,
                ...renderCycle.states[componentId],
              };
            }
          } else {
            componentObject.state = renderCycle.states[componentId];
            if (componentObject_Internal.ownerPage == currentPage) {
              ups.states[componentId] = componentId;
              componentObject_Internal.stateSync = 1;
            }
          }
        }
      }
    }

    //If a new page would be rendered in the current render cycle,
    //discard before update events of the current page components.
    if (!willRenderNewPage) {
      for (i in ups.states) {
        if (typeof states[i].beforeUpdate == "function") {
          //Execute before update events
          states[i].beforeUpdate.apply(states[i]);
        }
      }
    }

    ups.attributes = Object.keys(renderCycle.update);
    //We want to pass through every component once
    //Hence, we find the head components and discard the others
    var visitsCache = {};
    var heads = { count: -1, value: {} };
    getNestedComponents2(Object.keys(ups.states), visitsCache, heads);
    ups.states = Object.keys(heads.value);
    renderCycle.update = ups;
    //Register a batch update after 4 milliseconds
    setTimeout(batchUpdate, 4);
  }

  function setStateRenderer(componentsCount) {
    startNewCycle();
    if (!renderCycle.register[componentsCount]) {
      renderCycle.register[componentsCount] = componentsCount;
    }
  }

  function $Render(componentInfo, args) {
    if (!BreakerHydrate) {
      $Render = $MainRender;
      return $Render(componentInfo, args);
    }
    return setNonEnumerableObjectProperty({}, componentsIdentifier, {
      ref: componentInfo,
      args: args,
    });
  }

  function keepStateOnDetach(value) {
    this[symbolIdentifier].keepStateOnDetach =
      typeof value == "boolean" ? value : false;
  }
  function killOnDetach(value) {
    if (renderCycle.renderingMode) {
      return;
    }
    this[symbolIdentifier].killOnDetach =
      typeof value == "boolean" ? value : false;
  }

  function keepOnDetach(value) {
    this[symbolIdentifier].keepNodeOnDetach =
      typeof value == "boolean" ? value : false;
  }

  function destroyOnDetach(value) {
    clearAttrOnDetach(value);
  }
  function clearAttrOnDetach(value) {
    this[symbolIdentifier].clearAttrOnDetach =
      typeof value == "boolean" ? value : false;
  }
  function destroyNode(ref) {
    if (isHanging(ref)) {
      var id = ref[symbolIdentifier].id;
      states[id][symbolIdentifier].keepOnDetach = false;
      destroyComponent(id, false, true);
    }
  }
  function isHanging(ref) {
    return isDetached(ref) && states[id][symbolIdentifier].keepOnDetach;
  }
  function isDetached(ref) {
    return (
      ref[symbolIdentifier] &&
      states[ref[symbolIdentifier].id][symbolIdentifier].isDestroyed
    );
  }
  function eachComponent(cb) {
    for (var i in states) {
      cb(states[i][symbolIdentifier].ref);
    }
  }

  //Creates a new component
  function functionClass() {
    componentsCount++;
    var data = {};
    data[symbolIdentifier] = componentsCount;
    var ref = setNonEnumerableObjectProperty(
      {},
      symbolIdentifier,
      setFreezedObjectProperties(
        {},
        {
          classType: this.classType,
          id: componentsCount,
        }
      )
    );
    states[componentsCount] = setNonEnumerableObjectProperty(
      {},
      symbolIdentifier,
      {
        parent: 0,
        parentDNode: undefined,
        id: componentsCount,
        firstCall: false,
        childComponents: {},
        sharingState: [],
        isInserted: false,
        detached: false,
        dynamicNodes: [],
        domNode: null,
        objectNode: null,
        ownerPage: standAloneApps[symbolIdentifier].currentPage,
        keepNodeOnDetach: false,
        keepOnDetach: false,
        keepStateOnDetach: false,
        killOnDetach: true,
        pure: true,
        destroy: false,
        data: data,
        classType: this.classType,
        created: false,
        isDestroyed: true,
        keyedElements: {},
        ref: ref,
      }
    );
    // setFreezedObjectProperty(
    //   states[componentsCount],
    //   "keepStateOnDetach",
    //   keepStateOnDetach
    // );
    setFreezedObjectProperty(
      states[componentsCount],
      "keepOnDetach",
      keepOnDetach
    );
    // setFreezedObjectProperty(
    //   states[componentsCount],
    //   "resetAttrOnDetach",
    //   destroyOnDetach
    // );
    setFreezedObjectProperty(
      states[componentsCount],
      "destroyOnDetach",
      destroyOnDetach
    );
    data = null;
    return $Render(ref, arguments);
  }

  //Register a function as a component
  function Component(fn) {
    if (typeof fn != "function") {
      return fn;
    }
    componentTypesCount++;
    var componentType = componentTypesCount;
    componentTypes[componentType] = {
      class: componentType,
      instance: [],
      fn: fn,
      value: null,
    };
    const componentFunctionClass = functionClass.bind({
      classType: componentType,
    });

    return setFreezedObjectProperty(
      setNonEnumerableObjectProperty(
        componentFunctionClass,
        symbolIdentifier,
        setFreezedObjectProperties({}, { classType: componentType })
      ),
      "getInstanceRef",
      ComponentRef
    );
  }

  function Refresh(componentRef) {
    if (arguments.length > 0) {
      var componentObject =
        states[componentRef[symbolIdentifier].id][symbolIdentifier];
      if (componentObject.created && !componentObject.isDestroyed) {
        var i,
          args = [];
        for (i = 1; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        componentObject.refresh = true;
        startNewCycle();
        if (!renderCycle.register[componentRef[symbolIdentifier].id]) {
          renderCycle.register[componentRef[symbolIdentifier].id] =
            componentRef[symbolIdentifier].id;
          //renderCycle.queue.push(componentRef[symbolIdentifier].id);
        }
        renderCycle.refresh[componentRef[symbolIdentifier].id] = args;
      }
    }
  }

  //Render function
  function Render(instanceRef) {
    //Render must be passed at least a component's instanceRef
    if (arguments.length > 0 && arguments[0][symbolIdentifier]) {
      var args = Object.values(arguments).slice(1);
      return $Render(instanceRef, args);
    }
    return null;
  }

  function createCallback(This, fn, once) {
    var called = false;
    This = This[symbolIdentifier].data[symbolIdentifier];
    if (typeof fn == "function") {
      if (typeof once != "boolean") {
        once = false;
      }
      return function () {
        if (once /** This callback can be called once */) {
          if (!called) {
            called = true;
            return {
              v: fn.apply(states[This], arguments),
              x: (fn = This = null),
            }.v;
          }
        } /** Not clear when this callback isn't needed */ else {
          return fn.apply(states[This], arguments);
        }
      };
    }
    //Function not provided
    return fn;
  }
  /**
   * Use createMethod when you need both the component object
   * and the actual `this` of the method.
   * @param {*} This
   * @param {*} fn
   * @param {*} once
   * @returns
   */
  function createMethod(This, fn, once) {
    var called = false;
    This = This[symbolIdentifier].data[symbolIdentifier];
    if (typeof fn == "function") {
      if (typeof once != "boolean") {
        once = false;
      }
      return function () {
        if (once /** This callback can be called once */) {
          if (!called) {
            called = true;
            var args = Object.values(arguments || {});
            args.unshift([states[This]]);
            return { v: fn.apply(this, args), x: (fn = This = null) }.v;
          }
        } /** Not clear when this callback isn't needed */ else {
          args = Object.values(arguments || {});
          args.unshift([states[This]]);
          return fn.apply(this, args);
        }
      };
    }
    //Function not provided
    return null;
  }
  function writeDOM(task) {
    outOfScopeTasks.write.push(task);
  }
  function readDOM(task) {
    outOfScopeTasks.read.push(task);
  }
  //This is used to set callbacks that executes when a page
  //is about to exit for a new page.
  function onPageExit(This, callback) {
    if (!This[symbolIdentifier].data || typeof callback != "function") {
      return;
    }
    var currentPage = standAloneApps[symbolIdentifier].currentPage;
    standAloneApps[symbolIdentifier].onpageExit[currentPage][
      This[symbolIdentifier].id
    ] = callback;
  }
  //Sets callbacks to be executed when a new page is rendered.
  function onNewPage(This, callback) {
    if (!This[symbolIdentifier].data || typeof callback != "function") {
      return;
    }
    var currentPage = standAloneApps[symbolIdentifier].currentPage;
    standAloneApps[symbolIdentifier].onNewPage[currentPage][
      This[symbolIdentifier].id
    ] = callback;
  }
  //Sets an initial arguments to a component before it is created.
  function setInitArgs(componentRef, initArgs) {
    if (!states[componentRef[symbolIdentifier].id][symbolIdentifier].created) {
      states[componentRef[symbolIdentifier].id].initArgs = initArgs;
    }
    return componentRef;
  }
  //Compares two objects and returns a truthy value
  //dependeing on whether values of both are same or not
  function hasValuesChanged(currentState, update) {
    var updateKeys = Object.keys(update);
    if (Object.keys(currentState).length < updateKeys.length) {
      return {
        hasChanged: true,
        value: {
          ...currentState,
          ...update,
        },
      };
    }
    var merged = {
      ...currentState,
      ...update,
    };
    for (var i = 0; i < updateKeys.length; i++) {
      if (merged[updateKeys[i]] !== currentState[updateKeys[i]]) {
        return {
          hasChanged: true,
          value: merged,
        };
      }
    }
    return {
      hasChanged: false,
      value: currentState,
    };
  }

  function createSharedState(stateId, state) {
    if (!sharedStates[stateId]) {
      sharedStates[stateId] = {
        id: stateId,
        group: [],
        data: { ...state },
      };
    }
  }

  function getSharedState(This, stateId) {
    if (!This[symbolIdentifier].data) {
      return;
    }
    if (sharedStates[stateId]) {
      return sharedStates[stateId].data;
    }
  }

  function buildSharedState(componentsCount) {
    var state = {},
      sharingState = states[componentsCount][symbolIdentifier].sharingState,
      i;
    if (!sharingState.length) {
      return;
    }
    for (i = 0; i < sharingState.length; i++) {
      state[sharingState[i]] = sharedStates[sharingState[i]].data;
    }
    return state;
  }

  function joinSharedState(This, stateId, state) {
    const componentObject_Internal = This[symbolIdentifier];
    if (!componentObject_Internal.data) {
      return;
    }
    if (sharedStates[stateId]) {
      if (
        sharedStates[stateId].group.indexOf(componentObject_Internal.id) < 0
      ) {
        sharedStates[stateId].group.push(componentObject_Internal.id);
        componentObject_Internal.sharingState.push(stateId);
      }
    } else {
      sharedStates[stateId] = {
        id: stateId,
        group: [componentObject_Internal.id],
        data: {},
      };
      if (state) {
        sharedStates[stateId].data = { ...state };
      }
      componentObject_Internal.sharingState.push(stateId);
    }
  }

  function unjoinSharedState(This, stateId) {
    const componentObject_Internal = This[symbolIdentifier];
    if (!componentObject_Internal.data) {
      return;
    }
    if (sharedStates[stateId]) {
      var index;
      if (
        (index = sharedStates[stateId].group.indexOf(
          componentObject_Internal.id
        )) < 0
      ) {
        sharedStates[stateId].group.splice(index, 1);
        index = componentObject_Internal.sharingState.indexOf(stateId);
        componentObject_Internal.sharingState.splice(index, 1);
      }
    }
  }

  var PENDING_SHAREDSTATE_CHANGE = {};

  function setSharedState(This, stateId, state) {
    if (typeof sharedStates[stateId] != "object") {
      return;
    }
    const componentObject_Internal = This[symbolIdentifier];
    const RSS = renderCycle.sharedStates;
    var rssData = RSS[stateId];
    if (renderCycle.renderingMode) {
      if (!rssData || rssData.sync) {
        if (!PENDING_SHAREDSTATE_CHANGE[stateId]) {
          PENDING_SHAREDSTATE_CHANGE[stateId] = {};
        }
        PENDING_SHAREDSTATE_CHANGE[stateId] = state
          ? {
              ...PENDING_SHAREDSTATE_CHANGE[stateId],
              ...state,
            }
          : null;
        return;
      }
    }
    if (!componentObject_Internal.data) {
      return;
    }
    if (componentObject_Internal.sharingState.indexOf(stateId) < 0) {
      return;
    }
    rssData = RSS[stateId] = rssData || { value: {}, sync: 0 };
    rssData.value = state
      ? {
          ...(rssData.value || {}),
          ...state,
        }
      : null;

    startNewCycle();
  }

  var PENDING_STATE_CHANGE = {};
  //Set states of components. This automatically updates
  //the dynamic nodes in the component.
  function setState(This, state) {
    const componentObject_Internal = This[symbolIdentifier];
    const componentId = componentObject_Internal.id;
    if (renderCycle.renderingMode) {
      if (!componentObject_Internal.stateChanged) {
        if (!PENDING_STATE_CHANGE[componentId]) {
          PENDING_STATE_CHANGE[componentId] = {};
        }
        PENDING_STATE_CHANGE[componentId] = state
          ? {
              ...PENDING_STATE_CHANGE[componentId],
              ...state,
            }
          : null;
        return;
      }
    }

    if (!componentObject_Internal.data) {
      //Ignore state settings if first argument is not a component's object.
      //Reason: The component object has the state of the component stored.
      //It is needed for the state update.
      return;
    }

    //Trigger updates if component is not detached.
    if (
      !componentObject_Internal.isDestroyed &&
      !componentObject_Internal.stateSync
    ) {
      const RS = renderCycle.states;
      const rsData = RS[componentId];
      RS[componentId] = state
        ? {
            ...(rsData || {}),
            ...state,
          }
        : null;
      if (!componentObject_Internal.stateChanged) {
        //Set the state change switch on.
        componentObject_Internal.stateChanged = true;
        //If we are currently not in a rendering process, shedule one and
        //register this component to be updated in the next rendering cycle.
        setStateRenderer(componentId);
      }
    } else {
      if (This.state) {
        if (state) {
          This.state = {
            ...This.state,
            ...state,
          };
        } else {
          This.state = null;
        }
      } else {
        This.state = state ? { ...state } : null;
      }
    }
  }

  var PENDING_CLASS_CHANGE = {};
  //Add or remove classnames on elements of components.
  function setClass(This, key, classObject, internal_call) {
    const componentObject_Internal = This[symbolIdentifier];
    const componentId = componentObject_Internal.id;
    if (!componentObject_Internal.keyedElements[key]) {
      return; //Can't set class on unkeyed elements
    }
    var i,
      newClassUpdate = {};
    if (renderCycle.renderingMode) {
      //Put class settings on pending
      //Shall update later after current updates
      if (!componentObject_Internal.classChanged) {
        if (!PENDING_CLASS_CHANGE[componentId]) {
          PENDING_CLASS_CHANGE[componentId] = {};
        }
        if (!PENDING_CLASS_CHANGE[componentId][key]) {
          PENDING_CLASS_CHANGE[componentId][key] = {};
        }
        if (classObject.add) {
          for (i = 0; i < classObject.add.length; i++) {
            newClassUpdate[classObject.add[i]] = 1;
          }
        }
        if (classObject.remove) {
          for (i = 0; i < classObject.remove.length; i++) {
            newClassUpdate[classObject.remove[i]] = 0;
          }
        }
        PENDING_CLASS_CHANGE[componentId][key] = {
          ...PENDING_CLASS_CHANGE[componentId][key],
          ...newClassUpdate,
        };
        return;
      }
    }
    if (!componentObject_Internal.data) {
      return;
    }

    if (!renderCycle.attributes[componentId]) {
      renderCycle.attributes[componentId] = {};
    }
    if (!renderCycle.attributes[componentId][key]) {
      renderCycle.attributes[componentId][key] = {
        styles: {},
        classNames: {},
        attributes: {},
      };
    }

    if (internal_call == symbolIdentifier) {
      //Pending `setClass()` calls made internally has `classObject` in object form;
      newClassUpdate = classObject;
    } else {
      if (classObject.add) {
        for (i = 0; i < classObject.add.length; i++) {
          newClassUpdate[classObject.add[i]] = 1;
        }
      }
      if (classObject.remove) {
        for (i = 0; i < classObject.remove.length; i++) {
          newClassUpdate[classObject.remove[i]] = 0;
        }
      }
    }
    if (!componentObject_Internal.isDestroyed) {
      renderCycle.attributes[componentId][key].classNames = {
        ...renderCycle.attributes[componentId][key].classNames,
        ...newClassUpdate,
      };
      if (!componentObject_Internal.classChanged) {
        renderCycle.update[componentId] = componentId;
        //Set the state change switch on.
        componentObject_Internal.classChanged = true;
        startNewCycle();
      }
    } else {
      componentObject_Internal.keyedElements[key].classNames = {
        ...renderCycle.attributes[componentId][key].classNames,
        ...newClassUpdate,
      };
    }
  }

  var PENDING_STYLE_CHANGE = {};
  function setStyle(This, key, styleObject) {
    const componentObject_Internal = This[symbolIdentifier];
    const componentId = componentObject_Internal.id;
    if (!componentObject_Internal.keyedElements[key]) {
      return; //Can't set class on unkeyed elements
    }
    if (renderCycle.renderingMode) {
      if (!componentObject_Internal.styleChanged) {
        if (!PENDING_STYLE_CHANGE[componentId]) {
          PENDING_STYLE_CHANGE[componentId] = {};
        }
        if (!PENDING_STYLE_CHANGE[componentId][key]) {
          PENDING_STYLE_CHANGE[componentId][key] = {};
        }
        PENDING_STYLE_CHANGE[componentId][key] = {
          ...PENDING_STYLE_CHANGE[componentId],
          ...styleObject,
        };
        return;
      }
    }

    if (!componentObject_Internal.data) {
      //Ignore style settings if first argument is not a component's object.
      //Reason: The component object has the state of the component stored.
      //It is needed for the state update.
      return;
    }

    if (!renderCycle.attributes[componentId]) {
      renderCycle.attributes[componentId] = {};
    }
    if (!renderCycle.attributes[componentId][key]) {
      renderCycle.attributes[componentId][key] = {
        styles: {},
        classNames: {},
        attributes: {},
      };
    }
    if (!componentObject_Internal.isDestroyed) {
      renderCycle.attributes[componentId][key].styles = {
        ...renderCycle.attributes[componentId][key].styles,
        ...styleObject,
      };
      if (!componentObject_Internal.styleChanged) {
        renderCycle.update[componentId] = componentId;
        //Set the state change switch on.
        componentObject_Internal.styleChanged = true;
        startNewCycle();
      }
    } else {
      componentObject_Internal.keyedElements[key].styles = {
        ...componentObject_Internal.keyedElements[key].styles,
        ...styleObject,
      };
    }
  }

  var PENDING_ATTR_CHANGE = {};
  function setAttribute(This, key, attrObject) {
    const componentObject_Internal = This[symbolIdentifier];
    const componentId = componentObject_Internal.id;
    if (!componentObject_Internal.keyedElements[key]) {
      return; //Can't set class on unkeyed elements
    }
    if (renderCycle.renderingMode) {
      if (!componentObject_Internal.attrChanged) {
        if (!PENDING_ATTR_CHANGE[componentId]) {
          PENDING_ATTR_CHANGE[componentId] = {};
        }
        if (!PENDING_ATTR_CHANGE[componentId][key]) {
          PENDING_ATTR_CHANGE[componentId][key] = {};
        }
        PENDING_ATTR_CHANGE[componentId][key] = {
          ...PENDING_ATTR_CHANGE[componentId],
          ...attrObject,
        };
        return;
      }
    }
    if (!componentObject_Internal.data) {
      return;
    }
    if (!renderCycle.attributes[componentId]) {
      renderCycle.attributes[componentId] = {};
      renderCycle.update[componentId] = componentId;
    }
    if (!renderCycle.attributes[componentId][key]) {
      renderCycle.attributes[componentId][key] = {
        styles: {},
        classNames: {},
        attributes: {},
      };
    }

    if (!componentObject_Internal.isDestroyed) {
      renderCycle.attributes[componentId][key].attributes = {
        ...renderCycle.attributes[componentId][key].attributes,
        ...attrObject,
      };
      if (!componentObject_Internal.attrChanged) {
        renderCycle.update[componentId] = componentId;
        //Set the state change switch on.
        componentObject_Internal.attrChanged = true;
        startNewCycle();
      }
    } else {
      componentObject_Internal.keyedElements[key].attributes = {
        ...componentObject_Internal.keyedElements[key].attributes,
        ...attrObject,
      };
    }
  }

  //Returns a keyed element from a component
  function getElement(componentRef, key) {
    const componentId = componentRef[symbolIdentifier].id;
    const componentObject_Internal = states[componentId][symbolIdentifier];
    if (typeof key != "string") {
      //Return the head node of the component if key is not specified
      return componentObject_Internal.domNode;
    }
    if (!componentObject_Internal.keyedElements[key]) {
      return null;
    }
    return componentObject_Internal.keyedElements[key].element;
  }

  function setEvent(This, elementkey, eventSetter) {
    const componentObject_Internal = This[symbolIdentifier];
    const componentId = componentObject_Internal.id;
    const keyedEls = componentObject_Internal.keyedElements;
    if (keyedEls && keyedEls[elementkey]) {
      const events = keyedEls[elementkey].events;
      if (eventSetter.add) {
        var keyHolder = Object.keys(eventSetter.add),
          i = 0;
        var adders = {};
        while (i < keyHolder.length) {
          if (events[keyHolder[i]]) {
            events[keyHolder[i]] = eventSetter.add[keyHolder[i]];
          } else {
            events[keyHolder[i]] = eventSetter.add[keyHolder[i]];
            adders[keyHolder[i]] = eventSetter.add[keyHolder[i]];
          }
          i++;
        }
        var eventCallers = attachEvents(keyedEls[elementkey].element, adders, {
          componentId: componentId,
          key: elementkey,
        });
        keyedEls[elementkey].eventCallers = {
          ...keyedEls[elementkey].eventCallers,
          ...eventCallers,
        };
      }
      if (eventSetter.remove) {
        var rem = {};
        const { remove } = eventSetter;
        eventCallers = keyedEls[elementkey].eventCallers;
        i = 0;
        while (i < remove.length) {
          if (eventCallers[remove[i]]) {
            rem[remove[i]] = eventCallers[remove[i]];
            eventCallers[remove[i]] = null;
            delete eventCallers[remove[i]];
            events[remove[i]] = null;
            delete events[remove[i]];
          }
          i++;
        }
        removeEvents(keyedEls[elementkey].element, rem);
      }
    }
  }

  function getComponentRef(This) {
    return This[symbolIdentifier].ref;
  }
  function getParentComponentRef(childRef) {
    var parentId =
      states[childRef[symbolIdentifier].id][symbolIdentifier].parent;
    if (
      parentId /** parentId is always >=1 unless the component has no direct parent*/
    ) {
      return states[parentId][symbolIdentifier].ref;
    }
    return null;
  }
  function getSharedData(componentRef) {
    if (
      !states[componentRef[symbolIdentifier].id][symbolIdentifier].isDestroyed
    ) {
      if (states[componentRef[symbolIdentifier].id].public) {
        return {
          ...states[componentRef[symbolIdentifier].id].public,
        };
      }
    }
    return {};
  }
  var standAloneApps = {};
  var appCreation = {
    allow: true,
    key: symbolIdentifier,
  };
  standAloneApps[symbolIdentifier] = {
    created: false,
    currentPage: null,
    currentPageName: window.location.origin,
    onpageExit: {},
    onNewPage: {},
    visitedPages: {},
  };
  var pageStack = [],
    pagesCursor = 0,
    prePageCursor = 0;
  //Creates the first page of the app
  function createApp(appName, ref, argsTaker, destination) {
    if (!standAloneApps[symbolIdentifier].created && appCreation.allow) {
      standAloneApps[symbolIdentifier].created = true;
      standAloneApps[symbolIdentifier].currentPage = ref[symbolIdentifier].id;
      renderCycle.currentPage = ref[symbolIdentifier].id;
      // if(typeof (appName)=="undefined"){
      //     appName = window.location.pathname;
      // }
      appName = window.location.origin + appName;
      pageStack.push(appName);
      standAloneApps[symbolIdentifier].currentPageName = appName;
      standAloneApps[appName] = ref[symbolIdentifier].id;
      standAloneApps[symbolIdentifier].onpageExit[ref[symbolIdentifier].id] =
        {};
      standAloneApps[symbolIdentifier].onNewPage[ref[symbolIdentifier].id] = {};
      if (BreakerHydrate) {
        $PerformHydrationTask(
          ref,
          argsTaker(takeArguments),
          destination.children[0]
        );
        BreakerHydrate = false;
      } else {
        $Render(ref, argsTaker(takeArguments));
        destination.innerHTML = "";
        destination.appendChild(
          states[ref[symbolIdentifier].id][symbolIdentifier].domNode
        );
      }
      clearClonableViews();
    }
  }
  window.addEventListener(
    "popstate",
    function PagePopState(e) {
      var pathname = window.location.origin + window.location.pathname;
      if (standAloneApps[pathname]) {
        if (standAloneApps[symbolIdentifier].currentPageName != pathname) {
          var ref = {};
          ref[symbolIdentifier] = standAloneApps[pathname];
          Breaker.ui.renderPage(
            window.location.pathname,
            ref,
            function () {},
            true
          );
        }
      } else {
        history.replaceState(
          e.state,
          "",
          standAloneApps[symbolIdentifier].currentPageName
        );
      }
    },
    false
  );
  //Creates new page if not created and render
  //In place of current page
  /**
   *
   * @param {*} pageName
   * @param {*} ref
   * @param {(argumentsTaker:takeArguments)=>arguments} argsTaker
   * `argsTaker` must call and return the value returned by `argumentsTaker`
   */
  function renderPage(pageName, ref, argsTaker, popstate) {
    if (renderCycle.renderingMode) {
      return;
    }
    if (standAloneApps[symbolIdentifier].created) {
      pageName = window.location.origin + pageName;
      if (!standAloneApps[pageName]) {
        standAloneApps[pageName] = ref[symbolIdentifier].id;
        renderCycle.newPage.firstRender = true;
      }
      if (
        !standAloneApps[symbolIdentifier].onpageExit[ref[symbolIdentifier].id]
      ) {
        standAloneApps[symbolIdentifier].onpageExit[ref[symbolIdentifier].id] =
          {};
      }
      if (
        !standAloneApps[symbolIdentifier].onNewPage[ref[symbolIdentifier].id]
      ) {
        standAloneApps[symbolIdentifier].onNewPage[ref[symbolIdentifier].id] =
          {};
      }
      renderCycle.newPage.id = standAloneApps[pageName];
      renderCycle.newPage.pageName = pageName;
      renderCycle.newPage.isPoppedState = popstate;
      renderCycle.newPage.getArgs = argsTaker;
      startNewCycle();
    }
  }

  function lockAppCreation(secretId) {
    if (appCreation.allow) {
      appCreation.key = secretId;
      appCreation.allow = false;
    }
  }
  function unlockAppCreation(secretId) {
    if (appCreation.key === secretId) {
      appCreation.allow = true;
      appCreation.key = symbolIdentifier;
    }
  }
  function noopXSS(s) {
    return s;
  }

  const createTheme = (function () {
    var themes = 0;
    function createTheme(numOfThemes, styleMethod) {
      if (numOfThemes > 1) {
        themes++;
        const protoObj = {};
        protoObj[symbolIdentifier] = {
          numOfThemes,
          styleMethod,
          done: 1,
          all: { 0: 1 },
          theme: themes,
          on: 0,
        };
        const style = document.createElement("style");
        style.setAttribute("id", `theme-${themes}-0`);
        style.textContent = styleMethod(0);
        document.head.appendChild(style);
        const obj = Object.create(protoObj);
        protoObj.switchTheme = switchTheme.bind(obj);
        return obj;
      }
      return {};
    }
    function switchTheme(themeNum) {
      themeNum--;
      const { numOfThemes, on, all, theme, styleMethod } =
        this[symbolIdentifier];
      if (themeNum < numOfThemes && on != themeNum) {
        if (!all[themeNum]) {
          all[themeNum] = 1;
          this[symbolIdentifier].done++;
          const style = document.createElement("style");
          style.setAttribute("id", `theme-${theme}-${themeNum}`);
          style.textContent = styleMethod(themeNum);
          document.head.appendChild(style);
          if (this[symbolIdentifier].done == numOfThemes) {
            this[symbolIdentifier].styleMethod = null;
          }
        }
        document.getElementById(`theme-${theme}-${on}`).disabled = true;
        document.getElementById(`theme-${theme}-${themeNum}`).disabled = false;
        this[symbolIdentifier].on = themeNum;
      }
    }
    return createTheme;
  })();

  setFreezedObjectProperty(
    setFreezedObjectProperty(
      window,
      "Breaker",
      typeof IMEX == "undefined" ? {} : IMEX
    ).Breaker,
    "ui",
    setFreezedObjectProperties(
      {},
      {
        createTheme: createTheme,
        renderPage: renderPage,
        createComponent: Component,
        createApp: createApp,
        render: Render,
        refresh: Refresh,
        createCallback: createCallback,
        createMethod: createMethod,
        setState: setState,
        setStyle: setStyle,
        setAttribute: setAttribute,
        setClass: setClass,
        setInitArgs: setInitArgs,
        setEvent: setEvent,
        getElement: getElement,
        getSharedData: getSharedData,
        getComponentRef: getComponentRef,
        getParentComponentRef: getParentComponentRef,
        XSS: noopXSS,
        xss: noopXSS,
        writeDOM: writeDOM,
        readDOM: readDOM,
        onPageRerendered: onNewPage,
        onPageExit: onPageExit,
        getSharedState: getSharedState,
        setSharedState: setSharedState,
        joinSharedState: joinSharedState,
        unjoinSharedState: unjoinSharedState,
        createSharedState: createSharedState,
        lockAppCreation: lockAppCreation,
        unlockAppCreation: unlockAppCreation,

        //Make compatible with other libraries
        isDetached: isDetached,
        isMemoryLeakable: isHanging,
        destroyComponent: destroyNode,
        eachComponent: eachComponent,
        typeOfComponent: function (obj) {
          return obj && obj[symbolIdentifier] && obj[symbolIdentifier].id;
        },
      }
    )
  );
  //Not running on server
  setFreezedObjectProperty(Breaker, "jServe", false);
  Breaker.PAGEDATA = {};

  const NODETYPES = {
    TEXT: 1,
    COMPONENT: 2,
    LIST: 3,
    STATIC_ELEMENT: 4000,
  };

  function runElementEvent(eventData) {
    const componentObject = states[eventData.componentId];
    const componentObject_Internal = componentObject[symbolIdentifier];
    const element_Data = componentObject_Internal.keyedElements[eventData.key];
    //Run event
    element_Data.events[eventData.eventName].apply(eventData.event.target, [
      eventData.event,
      componentObject,
    ]);
    eventData.event = null;
  }

  function eventHandler(e) {
    const data = this;
    data.event = e;
    runElementEvent(data);
  }

  //Attach event handlers
  function attachEvents(element, events, { componentId, key }) {
    const keyHolder = Object.keys(events);
    const eventCallers = {};
    var i = 0;
    while (i < keyHolder.length) {
      eventCallers[keyHolder[i]] = eventHandler.bind({
        eventName: keyHolder[i],
        componentId: componentId,
        key: key,
      });
      element.addEventListener(keyHolder[i], eventCallers[keyHolder[i]], false);
      i++;
    }
    return eventCallers;
  }

  //Remove event handlers
  function removeEvents(element, eventCallers) {
    const keyHolder = Object.keys(eventCallers);
    var i = 0;
    while (i < keyHolder.length) {
      element.removeEventListener(
        keyHolder[i],
        eventCallers[keyHolder[i]],
        false
      );
      i++;
    }
  }
  //Remove set methods on elemenets
  function removeSetMethods(element, methods) {
    var keys = Object.keys(methods),
      i = 0;
    while (i < keys.length) {
      if (methods[keys[i]]) {
        //TODO: Remove this condition
        element[keys[i]] = null;
      }
      i++;
    }
  }

  //Remove event handler
  function removeEvent(element, eventName, eventHandler) {
    element.removeEventListener(eventName, eventHandler, false);
  }

  function toFlatArray(array) {
    var i = 0;
    var flatArr = [];
    while (i < array.length) {}
  }

  function toDistinctStringArray(array) {
    const keyHolder = {};
    var i = 0;
    while (i < array.length) {
      keyHolder[array[i]] = null;
      i++;
    }
    return Object.keys(keyHolder);
  }
  function toDistinctObject(array) {
    const keyHolder = {};
    var i = 0;
    while (i < array.length) {
      keyHolder[array[i]] = 1;
      i++;
    }
    return keyHolder;
  }

  function setStyleAttributes(element, styles) {
    const keyHolder = Object.keys(styles);
    var i = 0;
    while (i < keyHolder.length) {
      element.style[keyHolder[i]] = styles[keyHolder[i]];
      i++;
    }
  }

  function setElementAttributes(element, attr) {
    const keyHolder = Object.keys(attr);
    const methods = {};
    var i = 0,
      value;
    while (i < keyHolder.length) {
      value = attr[keyHolder[i]];
      switch (typeof value) {
        case "string":
          element.setAttribute(keyHolder[i], value);
          break;
        case "function":
          methods[keyHolder[i]] = true;
        default:
          element[keyHolder[i]] = value;
          break;
      }
      i++;
    }
    return methods;
  }

  function setElementStringAttributes(element, attr) {
    const keyHolder = Object.keys(attr);
    const methods = {};
    var i = 0,
      key,
      l = keyHolder.length;
    while (i < l) {
      key = keyHolder[i];
      element.setAttribute(key, attr[key]);
      i++;
    }
  }

  //Creates static elements of views
  function createElement(
    tagName,
    htmlAttributes,
    children,
    componentObject,
    isHead,
    useSVGNamespace,
    nodePosition
  ) {
    const componentObject_Internal = componentObject[symbolIdentifier];
    const componentId = componentObject_Internal.id;
    var classNames = { value: null },
      styleValue = {};
    var keyname;
    htmlAttributes = htmlAttributes || {};
    var keyedNodes = {};
    //jsAttributes = jsAttributes || {};

    function assignAttributes() {
      if (isKeyed) {
        keyname = htmlAttributes.key;
        if (htmlAttributes.class) {
          //Hold the object value of the class attribute
          classNames = htmlAttributes.class;
          //Reset the class attribute to its raw value
          //htmlAttributes.class = htmlAttributes.class.raw;
        }
        if (htmlAttributes.style) {
          //Hold the object value of the style attribute
          styleValue = htmlAttributes.style.value;
          //Reset the style attribute to its raw value
          htmlAttributes.style = htmlAttributes.style.raw;
        }
        htmlAttributes.key = "";
        delete htmlAttributes.key;
        setElementStringAttributes(element, htmlAttributes);
        htmlAttributes.style = htmlAttributes.class = null;
        delete htmlAttributes.style;
        delete htmlAttributes.class;
        keyedNodes[keyname] = {
          //element,
          classNames,
          styleValue,
          htmlAttributes,
          position: nodePosition,
        };
      } else {
        setElementStringAttributes(element, htmlAttributes);
      }
    }
    var isKeyed = !!nodePosition;
    element = useSVGNamespace
      ? document.createElementNS("http://www.w3.org/2000/svg", tagName)
      : document.createElement(tagName);
    assignAttributes();

    var dynamicNodes = [];
    var i = 0,
      dynamicNode,
      dynamicNodeMethod,
      dynamicNodePosition,
      dynamicNodeReplacer;
    l = children.length;
    while (i < l) {
      switch (Array.isArray(children[i])) {
        case true: //Dynamic node: This node may change later in the UI
          [dynamicNodeMethod, dynamicNodePosition] = children[i];
          dynamicNodeReplacer = document.createTextNode("");
          element.appendChild(dynamicNodeReplacer);
          dynamicNode = {
            position: dynamicNodePosition,
            method: dynamicNodeMethod,
            index: dynamicNodes.length,
          };
          dynamicNodes.push(dynamicNode);
          break;

        default:
          switch (children[i].type) {
            case NODETYPES.STATIC_ELEMENT: //Static node: Elements
              element.appendChild(children[i].element);
              //Join keyed nodes from this child element
              keyedNodes = {
                ...keyedNodes,
                ...children[i].keyedNodes,
              };
              //Join dynamic children of this child element to parent's dynamic nodes
              dynamicNodes = dynamicNodes.concat(children[i].dynamicNodes);
              break;

            default: //Static node: Texts
              element.appendChild(children[i]);
              break;
          }
          break;
      }
      i++;
    }

    if (isHead) {
      const { classType } = componentObject_Internal;
      componentTypes[classType].value = {
        element: element, //.cloneNode(true),
        keyedNodes: keyedNodes,
      };
      l = dynamicNodes.length;
      var cachedDynamicNodes = new Array(l);
      var dynamicInfo;
      for (i = 0; i < l; i++) {
        dynamicInfo = dynamicNodes[i]; //
        cachedDynamicNodes[i] = {
          position: dynamicInfo.position,
          method: dynamicInfo.method,
          index: dynamicInfo.index,
        };
      }
      componentTypes[classType].value.dynamicNodes = cachedDynamicNodes;
      cloneContainer.push(classType);
      return cloneView(componentObject);
    }

    return {
      type: NODETYPES.STATIC_ELEMENT,
      element,
      dynamicNodes,
      keyedNodes,
    };
  }

  var cloneContainer = [];
  //Clones views of component
  function cloneView(componentObject) {
    const componentObject_Internal = componentObject[symbolIdentifier];
    const classType = componentObject_Internal.classType;
    if (!componentTypes[classType].value) return;
    const componentId = componentObject_Internal.id;
    var { dynamicNodes, element } = componentTypes[classType].value;
    element = element.cloneNode(true);
    setDynamicAttributes(element, componentId);
    var l = dynamicNodes.length,
      i,
      dynamicNode;
    var mainDynamicnodes = [];
    var pairs = [];
    for (i = 0; i < l; i++) {
      const { method, index, position } = dynamicNodes[i];
      dynamicNode = getDynamicNodeValue(method, {
        ownerComponentId: componentId,
        parentDNodeIndex: index,
      });
      switch (dynamicNode.type) {
        case NODETYPES.COMPONENT:
          pairs.push([
            findElementNode(element, position),
            states[dynamicNode.value][symbolIdentifier].domNode,
          ]);
          break;

        default:
          pairs.push([findElementNode(element, position), dynamicNode.node]);
          if (dynamicNode.type == NODETYPES.LIST) {
            dynamicNode.node = null;
          }
          break;
      }
      mainDynamicnodes.push(dynamicNode);
    }
    var replacer, actualNode;
    for ([replacer, actualNode] of pairs) {
      replacer.replaceWith(actualNode);
    }

    return {
      element: element,
      dynamicNodes: mainDynamicnodes,
    };
  }

  //Traverses an element to find nested element
  function findElementNode(head, position) {
    var i = 0,
      l = position.length;
    while (i < l) {
      head = head.childNodes[position[i]];
      i++;
    }
    return head;
  }

  function setDynamicAttributes(element, componentId) {
    const componentObject = states[componentId];
    const componentObject_Internal = componentObject[symbolIdentifier];
    const { keyedNodes } =
      componentTypes[componentObject_Internal.classType].value;
    const keyedElementsObj = componentObject.elements || {};
    var keyHolder = Object.keys(keyedNodes);
    var keyedvalue,
      l = keyHolder.length;
    var keyname;
    var keyedEls = componentObject_Internal.keyedElements;
    if (keyedEls) {
      for (i = 0; i < l; i++) {
        keyname = keyHolder[i];
        keyedvalue = keyedEls[keyname];
        if (keyedvalue) {
          dynamicAttributeSetter(
            {
              keyedEls,
              keyname: keyname,
              jsAttributes: null,
              keyedvalue: keyedNodes[keyname],
              element: findElementNode(element, keyedNodes[keyname].position),
              componentId: componentId,
            },
            [
              keyedvalue.styles,
              keyedvalue.classNames,
              keyedvalue.attributes,
              keyedvalue.events,
              keyedvalue.eventCallers,
              keyedvalue.setMethods,
            ],
            true
          );
        } else {
          dynamicAttributeSetter(
            {
              keyedEls,
              keyname: keyname,
              jsAttributes: keyedElementsObj[keyname],
              keyedvalue: keyedNodes[keyname],
              element: findElementNode(element, keyedNodes[keyname].position),
              componentId: componentId,
            },
            [{}, {}, {}, {}, {}, {}]
          );
        }
      }
    } else {
      keyedEls = componentObject_Internal.keyedElements = {};
      for (i = 0; i < l; i++) {
        keyname = keyHolder[i];
        jsAttributes = keyedElementsObj[keyname];
        dynamicAttributeSetter(
          {
            keyedEls,
            keyname: keyname,
            jsAttributes: keyedElementsObj[keyname],
            keyedvalue: keyedNodes[keyname],
            element: findElementNode(element, keyedNodes[keyname].position),
            componentId: componentId,
          },
          [{}, {}, {}, {}, {}, {}]
        );
      }
    }
  }

  function dynamicAttributeSetter(
    { keyedEls, keyname, jsAttributes, keyedvalue, element, componentId },
    [styles, classNames, attributes, events, eventCallers, setMethods],
    reuse
  ) {
    if (reuse) {
      setStyleAttributes(element, styles);
      var clsnme = Object.keys(classNames);
      if (clsnme.length) {
        element.setAttribute("class", clsnme.join(" "));
      }
      eventCallers = attachEvents(element, events, {
        componentId: componentId,
        key: keyname,
      });
      setMethods = setElementAttributes(element, attributes);
    }

    //If keyed Attributes were cleared or not set,
    //Create from dynamic attributes and attributes from views
    else {
      jsAttributes = jsAttributes || {};
      if (jsAttributes.style) {
        setStyleAttributes(element, jsAttributes.style);
        styles = {
          ...keyedvalue.styleValue,
          ...jsAttributes.style,
        };
      } else {
        styles = keyedvalue.styleValue;
      }

      //Class attribute was set on keyed element in component view
      if (keyedvalue.classNames.value) {
        //Class attribute was also set dynamically
        //We join classnames
        if ((jsAttributes.class || "").length) {
          classNames = {
            ...keyedvalue.classNames.value,
            ...toDistinctObject(jsAttributes.class.split(" ")),
          };
          jsAttributes.class = [
            keyedvalue.classNames.raw,
            jsAttributes.class,
          ].join(" ");
          //keyedvalue.element.setAttribute("class",)
        } else {
          classNames = keyedvalue.classNames.value;
          jsAttributes.class = keyedvalue.classNames.raw;
        }
      }
      //Class attribute was not set on keyed element in component view
      else {
        //Class attribute was also set dynamically
        if ((jsAttributes.class || "").length) {
          classNames = toDistinctObject(jsAttributes.class.split(" "));
        }
      }

      //Attach event listeners if exists.
      events = jsAttributes.$events || {};
      eventCallers = attachEvents(element, events, {
        componentId: componentId,
        key: keyname,
      });
      jsAttributes.$events = null;
      delete jsAttributes.$events;
      jsAttributes.style = null;
      delete jsAttributes.style;
      attributes = jsAttributes;
      setMethods = setElementAttributes(element, attributes);
      attributes.class = null;
      delete attributes.class;
    }

    keyedEls[keyname] = {
      attributes,
      classNames,
      styles,
      events, //Object containing the actual event listeners set by developer
      eventCallers, //Object containing all attached events via addEventListener
      setMethods, //Object containing all method names set on element
      element: element,
    };
  }

  //Returns a text node
  function createText(text) {
    return document.createTextNode(text);
  }

  function setupComponentForNewParent(componentId, newParentDNodeIndex) {
    const componentObject_Internal = states[componentId][symbolIdentifier];
    // if (componentObject_Internal.isDestroyed) {
    //   componentObject_Internal.parentDNode = newParentDNodeIndex;
    //   return;
    // }
    var parent = componentObject_Internal.parent;
    if (!parent) {
      componentObject_Internal.parentDNode = newParentDNodeIndex;
      return;
    }
    var parentComponentObject_Internal = states[parent][symbolIdentifier];
    if (!parentComponentObject_Internal.domNode) {
      componentObject_Internal.parentDNode = newParentDNodeIndex;
      return;
    }
    var parentDNode = componentObject_Internal.parentDNode;
    var replacerNode = document.createTextNode("");
    var dynamicNodes = parentComponentObject_Internal.dynamicNodes;
    //If component is currently among a list
    //It means we are removing a life component from the list
    if (Array.isArray(parentDNode)) {
      var [parentDNodeIndex, nodeIndex] = parentDNode;
      var dynamicNode = dynamicNodes[parentDNodeIndex];
      var actualNode = dynamicNode.value[nodeIndex];
      componentObject_Internal.domNode.replaceWith(replacerNode);
      switch (actualNode.value) {
        case dynamicNode.head.value:
          dynamicNode.head = {
            type: NODETYPES.TEXT,
            value: "",
            node: replacerNode,
          };
        case dynamicNode.tail.value:
          dynamicNode.tail = {
            type: NODETYPES.TEXT,
            value: "",
            node: replacerNode,
          };
          break;
      }
      actualNode.type = NODETYPES.TEXT;
      actualNode.value = "";
      componentObject_Internal.parentDNode = newParentDNodeIndex;
      return;
    }
    dynamicNode = dynamicNodes[parentDNode];
    componentObject_Internal.domNode.replaceWith(replacerNode);
    dynamicNodes[parentDNode] = {
      type: NODETYPES.TEXT,
      value: "",
      node: replacerNode,
      nodeMethod: dynamicNode.nodeMethod,
    };
    componentObject_Internal.parentDNode = newParentDNodeIndex;
  }
  //Remove from child components of parent component and returns the child id;
  function removeFromChildComponents(child) {
    var child_Internal = states[child][symbolIdentifier];
    var parent_internal = states[child_Internal.parent][symbolIdentifier];
    parent_internal.childComponents[child] = null;
    delete parent_internal.childComponents[child];
    return child;
  }

  function swapNodeWithTextValue(oldNode, text) {
    var { type, value, node } = oldNode;
    var componentsToDestroy = [];
    switch (type) {
      case NODETYPES.TEXT:
        if (value != text) {
          node.textContent = text;
          oldNode.value = text;
        }
        break;
      case NODETYPES.COMPONENT:
        node = states[value][symbolIdentifier].domNode;
        componentsToDestroy.push(value);
        removeFromChildComponents(value);
        oldNode.value = text;
        oldNode.type = NODETYPES.TEXT;
        oldNode.node = createText(text);
        node.replaceWith(oldNode.node);
        break;
      case NODETYPES.LIST:
        var { head, tail } = oldNode;
        oldNode.head = null;
        oldNode.tail = null;
        if (head.type == NODETYPES.TEXT) {
          if (head.value != text) {
            head.node.textContent = text;
          }
          var boundary = tail.node.nextSibling,
            i = 1;
          while (head.node.nextSibling != boundary) {
            head.node.nextSibling.remove();
            if (value[i].type == NODETYPES.COMPONENT) {
              //`removeFromChildComponents(a):a`
              componentsToDestroy.push(
                removeFromChildComponents(value[i].value)
              );
            }
            i++;
          }
          oldNode.node = head.node;
        } else if (tail.type == NODETYPES.TEXT) {
          if (tail.value != text) {
            tail.node.textContent = text;
          }
          boundary = head.node.previousSibling;
          i = value.length - 2;
          while (tail.node.previousSibling != boundary) {
            tail.node.previousSibling.remove();
            if (value[i].type == NODETYPES.COMPONENT) {
              //`removeFromChildComponents(a):a`
              componentsToDestroy.push(
                removeFromChildComponents(value[i].value)
              );
            }
            i--;
          }
          oldNode.node = tail.node;
        } else {
          boundary = tail.node.nextSibling;
          i = 1;
          while (head.node.nextSibling != boundary) {
            head.node.nextSibling.remove();
            if (value[i].type == NODETYPES.COMPONENT) {
              //`removeFromChildComponents(a):a`
              componentsToDestroy.push(
                removeFromChildComponents(value[i].value)
              );
            }
            i++;
          }
          if (value[0].type == NODETYPES.COMPONENT) {
            componentsToDestroy.push(value[0].value);
          }
          oldNode.node = createText(text);
          head.node.replaceWith(oldNode.node);
        }
        oldNode.value = text;
        oldNode.type = NODETYPES.TEXT;
        break;
    }
    return componentsToDestroy;
  }

  function swapNodeWithComponent(
    oldNode,
    newComponentId,
    { parentComponentId, dynamicNodeIndex }
  ) {
    var { type, value, node } = oldNode;
    var newNode = states[newComponentId][symbolIdentifier].domNode;
    var componentsToDestroy = [];
    switch (type) {
      case NODETYPES.TEXT:
        setupComponentForNewParent(newComponentId, dynamicNodeIndex);
        node.replaceWith(newNode);
        break;
      case NODETYPES.COMPONENT:
        if (value != newComponentId) {
          node = states[value][symbolIdentifier].domNode;
          //`removeFromChildComponents(a):a`
          componentsToDestroy.push(removeFromChildComponents(value));
          setupComponentForNewParent(newComponentId, dynamicNodeIndex);
          node.replaceWith(newNode);
        }
        break;
      case NODETYPES.LIST:
        var { head, tail } = oldNode;
        oldNode.head = null;
        oldNode.tail = null;
        var boundary = tail.node.nextSibling;
        var i = 1;
        var existsInList = false;
        while (head.node.nextSibling != boundary) {
          if (value[i].type == NODETYPES.COMPONENT) {
            if (value[i].value == newComponentId) {
              existsInList = true;
            } else {
              //`removeFromChildComponents(a):a`
              componentsToDestroy.push(
                removeFromChildComponents(value[i].value)
              );
              head.node.nextSibling.remove();
            }
          } else {
            head.node.nextSibling.remove();
          }
          i++;
        }

        if (existsInList) {
          if (value[0].type == NODETYPES.COMPONENT) {
            //`removeFromChildComponents(a):a`
            componentsToDestroy.push(removeFromChildComponents(value[0].value));
          }
          head.node.remove();
        } else {
          if (value[0].type == NODETYPES.COMPONENT) {
            if (value[0].value != newComponentId) {
              //`removeFromChildComponents(a):a`
              componentsToDestroy.push(
                removeFromChildComponents(value[0].value)
              );
              setupComponentForNewParent(newComponentId, dynamicNodeIndex);
              head.node.replaceWith(newNode);
            }
          } else {
            setupComponentForNewParent(newComponentId, dynamicNodeIndex);
            head.node.replaceWith(newNode);
          }
        }
        break;
    }
    //Set the parent component on chhild
    //This creates the connection to allow `getParentComponentRef()`
    states[newComponentId][symbolIdentifier].parent = parentComponentId;
    //Set its new corresponding `dynamicNodeIndex` in parent component
    states[newComponentId][symbolIdentifier].parentDNode = dynamicNodeIndex;
    states[parentComponentId][symbolIdentifier].childComponents[
      newComponentId
    ] = newComponentId;
    oldNode.value = newComponentId;
    oldNode.type = NODETYPES.COMPONENT;
    oldNode.node = null;
    return componentsToDestroy;
  }

  function swapNodeWithList(
    oldNode,
    list,
    { parentComponentId, dynamicNodeIndex }
  ) {
    var { type, value, node, nodeMethod } = oldNode;
    var componentsToDestroy = [];
    switch (type) {
      case NODETYPES.TEXT:
        var listNodeValue = getDynamicNodeListValues(list, nodeMethod, {
          parentComponentId,
          dynamicNodeIndex,
        });
        node.replaceWith(listNodeValue.node);
        break;
      case NODETYPES.COMPONENT:
        var boundary = document.createTextNode("");
        node = states[value][symbolIdentifier].domNode;
        node.parentNode.insertBefore(boundary, node);
        listNodeValue = getDynamicNodeListValues(list, nodeMethod, {
          parentComponentId,
          dynamicNodeIndex,
        });
        if (!listNodeValue.unique[value]) {
          componentsToDestroy.push(removeFromChildComponents(value));
          node.remove();
        }
        boundary.replaceWith(listNodeValue.node);
        break;
      case NODETYPES.LIST:
        listNodeValue = listUpdater(oldNode, list, {
          parentComponentId,
          dynamicNodeIndex,
        });
        componentsToDestroy = componentsToDestroy.concat(
          listNodeValue.componentsToDestroy
        );
        listNodeValue = listNodeValue.listValue;
        break;
    }
    oldNode.type = NODETYPES.LIST;
    oldNode.head = listNodeValue.head;
    oldNode.tail = listNodeValue.tail;
    oldNode.unique = listNodeValue.unique;
    oldNode.value = listNodeValue.value;
    listNodeValue.node = null;
    return componentsToDestroy;
  }

  function getDynamicNodeValue(
    nodeMethod,
    { ownerComponentId, parentDNodeIndex }
  ) {
    const ownerComponentObject = states[ownerComponentId];
    const ownerComponentObject_Internal =
      ownerComponentObject[symbolIdentifier];
    var dynamicChildValue = nodeMethod.apply(
      ownerComponentObject,
      ownerComponentObject_Internal.currentArgument
    );
    switch (typeof dynamicChildValue) {
      case "object":
        //A Null is considered an empty ("") text node
        if (!dynamicChildValue) {
          return {
            type: NODETYPES.TEXT,
            value: "",
            node: document.createTextNode(""),
            nodeMethod: nodeMethod,
          };
        }
        //Components are identified by their IDs
        if (dynamicChildValue[componentsIdentifier]) {
          dynamicChildValue = dynamicChildValue[componentsIdentifier];
          setupComponentForNewParent(dynamicChildValue, parentDNodeIndex);
          states[dynamicChildValue][symbolIdentifier].parent = ownerComponentId;
          ownerComponentObject_Internal.childComponents[dynamicChildValue] =
            dynamicChildValue;
          return {
            type: NODETYPES.COMPONENT,
            value: dynamicChildValue,
            node: null,
            nodeMethod: nodeMethod,
          };
        }
        //Lists are identified by arrays
        if (Array.isArray(dynamicChildValue)) {
          //An empty array is considered an empty ("") text node
          if (!dynamicChildValue.length) {
            return {
              type: NODETYPES.TEXT,
              value: "",
              node: document.createTextNode(""),
              nodeMethod: nodeMethod,
            };
          }
          return getDynamicNodeListValues(dynamicChildValue, nodeMethod, {
            parentComponentId: ownerComponentId,
            dynamicNodeIndex: parentDNodeIndex,
          });
        }

      default:
        dynamicChildValue = "" + dynamicChildValue;
        return {
          type: NODETYPES.TEXT,
          value: dynamicChildValue,
          node: document.createTextNode(dynamicChildValue),
          nodeMethod: nodeMethod,
        };
    }
  }

  function getDynamicNodeListValues(
    list,
    nodeMethod,
    { parentComponentId, dynamicNodeIndex }
  ) {
    var i = 0,
      j = 0,
      listValues = new Array(list.length),
      value,
      node;
    var unique = {};
    var elComponentId;
    const listNode = document.createDocumentFragment();
    while (j < list.length) {
      value = list[i];
      switch (typeof value) {
        case "object":
          //A Null is considered an empty ("") text node
          if (!value) {
            listValues[i] = {
              type: NODETYPES.TEXT,
              value: "",
            };
            node = document.createTextNode("");
            listNode.appendChild(node);
            i++;
          }
          //Components are identified by their IDs
          else if (value[componentsIdentifier]) {
            elComponentId = value[componentsIdentifier];
            if (!unique[elComponentId]) {
              unique[elComponentId] = i + 1;
              listValues[i] = {
                type: NODETYPES.COMPONENT,
                value: elComponentId,
              };
              node = states[elComponentId][symbolIdentifier].domNode;
              setupComponentForNewParent(elComponentId, [dynamicNodeIndex, i]);
              //Set parent component ID on child component
              states[elComponentId][symbolIdentifier].parent =
                parentComponentId;
              //Add child component's ID to children components of parent.
              states[parentComponentId][symbolIdentifier].childComponents[
                elComponentId
              ] = elComponentId;
              listNode.appendChild(node);
              i++;
            }
          }

          //NOTE: List elements must only be texts (Strings|null) or a component.
          break;
        default:
          value = "" + value;
          listValues[i] = {
            type: NODETYPES.TEXT,
            value: value,
          };
          node = document.createTextNode(value);
          listNode.appendChild(node);
          i++;
      }
      j++;
    }
    listValues = listValues.slice(0, i);
    return {
      type: NODETYPES.LIST,
      value: listValues,
      node: listNode,
      head: { ...listValues[0], node: listNode.childNodes[0] },
      tail: {
        ...listValues[listValues.length - 1],
        node: listNode.childNodes[listNode.childNodes.length - 1],
      },
      nodeMethod: nodeMethod,
      unique: unique,
    };
  }

  function runComponentMethods(componentId) {
    const componentObject = states[componentId];
    const componentObject_Internal = componentObject[symbolIdentifier];
    var args = componentObject_Internal.currentArgument.argument;
    var fromParent = componentObject_Internal.currentArgument.fromParent;

    //Run setup method if only the component has not be set up (ever rendered or mounted)
    if (!componentObject_Internal.created) {
      componentObject_Internal.created = true;
      fromParent = true;
      if (typeof componentObject.onCreation == "function") {
        componentObject.onCreation.apply(componentObject, args);
      }
      componentObject.initArgs = undefined;
    }
    componentObject.onCreation = null;

    //Attach component's sharing state object if registered for any
    //Registration is supposed to be done in the `onCreation()` method
    componentObject.sharedState = buildSharedState(componentId);

    //The `onParentRender()` method if set, runs every time the component is visited
    //for mounting or updates because a parent component is mounting/updating.
    if (fromParent && typeof componentObject.onParentRender == "function") {
      componentObject.onParentRender.apply(componentObject, args);
    }
    componentObject_Internal.currentArgument =
      componentObject.state || componentObject.sharedState ? undefined : args;
  }
  //Rendering engine
  function $MainRender(componentInfo, args) {
    const componentId = componentInfo[symbolIdentifier].id;
    const classFunctionId = componentInfo[symbolIdentifier].classType;
    const componentObject = states[componentId];
    const componentObject_Internal = componentObject[symbolIdentifier];
    const componentClassFunction = componentTypes[classFunctionId].fn;
    const componentRef = {};
    componentRef[componentsIdentifier] = componentId;
    //Component at this moment is about to be mounted or update dynamic nodes
    //hence, component is assumed to be alive or not detached/unmounted
    componentObject_Internal.isDestroyed = false;
    componentObject_Internal.stateChanged = false;

    //
    args =
      args !== symbolIdentifier
        ? { fromParent: true, argument: args }
        : { fromParent: false, argument: undefined };

    componentObject_Internal.currentArgument = args;

    //If first time rendering after detach or not ever rendered
    if (!componentObject_Internal.firstCall) {
      componentObject_Internal.firstCall = true;
      Object.setPrototypeOf(componentObject, {
        keepStateOnDetach,
        keepOnDetach,
        killOnDetach,
        clearAttrOnDetach,
      });
      //Run the component function
      const componentElement = componentClassFunction.apply(
        componentObject,
        args.argument
      );
      //This contains data on all dynamic nodes in the component
      componentObject_Internal.dynamicNodes = componentElement.dynamicNodes;
      //This is the main component element (the head node of the component)
      componentObject_Internal.domNode = componentElement.element;
      //This keeps data on all keyed elements in the component view
      //componentObject_Internal.keyedElements = componentElement.keyedElements;

      componentObject_Internal.domNodeChanged = true;
      componentObject_Internal.ownerPage =
        standAloneApps[symbolIdentifier].currentPage;
      componentObject_Internal.detached = false;
      //Clear the elements object of the component
      componentObject.elements = null;
    } else {
      //The `onParentRender()` method if set, runs every time the component is visited
      //for mounting or updates because a parent component is mounting/updating.
      if (
        args.fromParent &&
        typeof componentObject.onParentRender == "function"
      ) {
        componentObject.onParentRender.apply(componentObject, args.argument);
      }
      //If component is stateful (has its state set), check if state is changed
      // if (typeof renderCycle.states[componentId] == "object") {
      //   if (!componentObject_Internal.stateChanged) {
      //     return componentRef;
      //   }
      //   componentObject_Internal.stateChanged = false;
      // }
      var i = 0;
      var value;
      var dynamicNodes = componentObject_Internal.dynamicNodes;
      var Args =
        componentObject.state || componentObject.sharedState
          ? undefined
          : args.argument;
      var componentsToDestroy = renderCycle.unwantedComponents;
      while (i < dynamicNodes.length) {
        value = dynamicNodes[i].nodeMethod.apply(componentObject, Args);
        switch (typeof value) {
          case "object":
            if (!value) {
              componentsToDestroy = componentsToDestroy.concat(
                swapNodeWithTextValue(dynamicNodes[i], "")
              );
            } else if (value[componentsIdentifier]) {
              componentsToDestroy = componentsToDestroy.concat(
                swapNodeWithComponent(
                  dynamicNodes[i],
                  value[componentsIdentifier],
                  { parentComponentId: componentId, dynamicNodeIndex: i }
                )
              );
            } else if (Array.isArray(value)) {
              if (value.length) {
                componentsToDestroy = componentsToDestroy.concat(
                  swapNodeWithList(dynamicNodes[i], value, {
                    parentComponentId: componentId,
                    dynamicNodeIndex: i,
                  })
                );
              } else {
                componentsToDestroy = componentsToDestroy.concat(
                  swapNodeWithTextValue(dynamicNodes[i], "")
                );
              }
            } else {
              componentsToDestroy = componentsToDestroy.concat(
                swapNodeWithTextValue(dynamicNodes[i], "" + value)
              );
            }
            break;
          default:
            componentsToDestroy = componentsToDestroy.concat(
              swapNodeWithTextValue(dynamicNodes[i], "" + value)
            );
            break;
        }
        i++;
      }
      renderCycle.unwantedComponents = componentsToDestroy;
    }
    componentObject_Internal.currentArgument = undefined;
    componentObject_Internal.stateSync = 0;
    return componentRef;
  }

  function listUpdater(
    oldList,
    newList,
    { parentComponentId, dynamicNodeIndex }
  ) {
    const { value, head, tail, unique, nodeMethod } = oldList;
    var l1 = value.length;
    var l2 = newList.length;
    var listValue;
    //Allocate list space for new list
    var newListValues = new Array(l2);
    var componentsToDestroy = [];
    var newUnique = {};
    var i = 0,
      j = 0,
      m = 0,
      n = 0;
    //Turn list values to compatible DOM node values
    while (i < l2) {
      listValue = getActualListValue(newList[i]);
      if (listValue.type == NODETYPES.COMPONENT) {
        //Take out duplicate components
        if (!newUnique[listValue.value]) {
          newUnique[listValue.value] = j + 1;
          newListValues[m] = listValue;
          j++;
          m++;
        }
      } else {
        newListValues[m] = listValue;
        m++;
      }
      i++;
    }
    //Take out unwanted space caused by duplicate components
    newListValues = newListValues.slice(0, m);
    //Decide whether to pass through list from top
    l2 = newListValues.length;
    i = j = m = 0;
    var l3 = Math.ceil(l1 / 2);
    loop1: while (i < l3 && j < l2) {
      listValue = newListValues[j];
      switch (value[i].type) {
        case NODETYPES.TEXT:
          if (listValue.type != NODETYPES.TEXT) {
            break loop1;
          }
          break;
        default: //Component
          if (
            listValue.type != NODETYPES.COMPONENT ||
            listValue.value != value[i].value
          ) {
            break loop1;
          }
          break;
      }
      i++;
      j++;
    }
    //If passing through list from top will not save us from
    //touching the DOM at least half-way, try passing through
    //by the bottom and find the best of the two
    m = i;
    if (m + 1 < l3) {
      i = l1 - 1;
      j = l2 - 1;
      loop2: while (i >= 0 && j >= 0) {
        listValue = newListValues[j];
        switch (value[i].type) {
          case NODETYPES.TEXT:
            if (listValue.type != NODETYPES.TEXT) {
              break loop2;
            }
            break;
          default: //Component
            if (
              listValue.type != NODETYPES.COMPONENT ||
              listValue.value != value[i].value
            ) {
              break loop2;
            }
            break;
        }
        n++;
        i--;
        j--;
        if (n > m) {
          break;
        }
      }
    }

    //The best route through the lis is used to update the list
    //in the following code
    var textNode;
    var textToDiscard = [];
    var boundary = document.createTextNode("");
    if (m >= n) {
      var currentNode = head.node;
      var node1,
        node2,
        endFound = false;
      var toggler = {
        sibling: "nextSibling",
        lengthCondition: () => i < l2,
        lastWhileCondition: () => i < newListValues.length,
        incre: () => {
          i++;
        },
        incre_I_only: () => {
          i++;
        },
        i: () => i,
      };
      toggler.lastWhileIncre = toggler.incre;
      toggler.j = toggler.l = toggler.i;
      var parent = currentNode.parentNode;
      //Insert boundary
      parent.insertBefore(boundary, tail.node.nextSibling);
      i = 0;
    } else {
      currentNode = tail.node;
      toggler = {
        sibling: "previousSibling",
        lengthCondition: () => j >= 0,
        lastWhileCondition: () => l <= j,
        incre: () => {
          i--;
          j--;
        },
        incre_I_only: () => {
          i--;
        },
        lastWhileIncre: () => {
          l++;
        },
        i: () => i,
        j: () => j,
        l: () => l,
      };
      parent = currentNode.parentNode;
      //Insert boundary
      parent.insertBefore(boundary, head.node);
      i = l1 - 1;
      j = l2 - 1;
      var l = 0;
    }
    var sibling;
    while (currentNode != boundary && toggler.lengthCondition()) {
      i = toggler.i();
      listValue = newListValues[toggler.j()];
      switch (value[i].type) {
        case NODETYPES.TEXT: //Old node at this position is text node
          switch (listValue.type) {
            case NODETYPES.TEXT: //New node to replace old is supposed to be a text node
              //We can reuse the old text node by changing the
              //textContent rather than creating a new text node
              if (listValue.value != value[i].value) {
                //We reset the text node if only the text values are different
                currentNode.textContent = listValue.value;
                if (!endFound) {
                  endFound = true;
                  node1 = currentNode;
                }
              }
              break;
            default: //Component
              setupComponentForNewParent(listValue.value, [
                dynamicNodeIndex,
                toggler.j(),
              ]);
              //Replace old node with the new node (component head node)
              currentNode.replaceWith(
                states[listValue.value][symbolIdentifier].domNode
              );
              //Set the parent ID on child component
              //This sets the link or connection for `getParenrComponentRef()` to return the right parent component
              states[listValue.value][symbolIdentifier].parent =
                parentComponentId;
              //Add component as child component of its parent component
              states[parentComponentId][symbolIdentifier].childComponents[
                listValue.value
              ] = listValue.value;
              //Add old node (text node) to the discarded text nodes
              //We shal reuse them if needed rather than recreating new ones
              textToDiscard.push(currentNode);
              currentNode = states[listValue.value][symbolIdentifier].domNode;
              break;
          }
          break;
        //
        default: //Old node at this position is a component head node
          switch (listValue.type) {
            case NODETYPES.TEXT: //New node to replace old is supposed to be a text node
              textNode =
                textToDiscard.pop() || document.createTextNode(listValue.value);
              textNode.textContent = listValue.value;
              componentsToDestroy.push(
                removeFromChildComponents(value[i].value)
              );
              //Replace the old node (component head node) with the new node (text node)
              currentNode.replaceWith(textNode);
              currentNode = textNode;
              break;
            default: //Component
              if (value[i].value != listValue.value) {
                //Add old node (component) to components to detach later
                componentsToDestroy.push(
                  removeFromChildComponents(value[i].value)
                );
                setupComponentForNewParent(listValue.value, [
                  dynamicNodeIndex,
                  toggler.j(),
                ]);
                //Replace old node with the new node (component head node)
                currentNode.replaceWith(
                  states[listValue.value][symbolIdentifier].domNode
                );
                //Set the parent ID on child component
                //This sets the link or connection for `getParenrComponentRef()` to return the right parent component
                states[listValue.value][symbolIdentifier].parent =
                  parentComponentId;
                //Add component as child component of its parent component
                states[parentComponentId][symbolIdentifier].childComponents[
                  listValue.value
                ] = listValue.value;
                currentNode = states[listValue.value][symbolIdentifier].domNode;
              }
              break;
          }
          break;
      }
      if (!endFound) {
        endFound = true;
        node1 = currentNode;
      }
      currentNode = currentNode[toggler.sibling];
      toggler.incre();
    }
    if (toggler.lengthCondition()) {
      var docf = document.createDocumentFragment();
      while (toggler.lastWhileCondition()) {
        listValue = newListValues[toggler.l()];
        if (listValue.type == NODETYPES.COMPONENT) {
          setupComponentForNewParent(listValue.value, [
            dynamicNodeIndex,
            toggler.l(),
          ]);
          docf.appendChild(states[listValue.value][symbolIdentifier].domNode);
          //Set the parent ID on child component
          //This sets the link or connection for `getParenrComponentRef()` to return the right parent component
          states[listValue.value][symbolIdentifier].parent = parentComponentId;
          //Add component as child component of its parent component
          states[parentComponentId][symbolIdentifier].childComponents[
            listValue.value
          ] = listValue.value;
        } else {
          textNode =
            textToDiscard.pop() || document.createTextNode(listValue.value);
          textNode.textContent = listValue.value;
          docf.appendChild(textNode);
        }
        toggler.lastWhileIncre();
      }
      if (docf.childNodes.length) {
        parent.insertBefore(docf, boundary);
      }
    } else {
      while (currentNode != boundary) {
        sibling = currentNode[toggler.sibling];
        currentNode.remove();
        currentNode = sibling;
        if (value[i].type == NODETYPES.COMPONENT) {
          componentsToDestroy.push(removeFromChildComponents(value[i].value));
        }
        toggler.incre_I_only();
      }
    }
    //Get head and tail nodes
    if (toggler.sibling == "nextSibling") {
      node2 = boundary.previousSibling;
    } else {
      node2 = node1;
      node1 = boundary.nextSibling;
    }
    boundary.remove();

    return {
      listValue: {
        type: NODETYPES.LIST,
        value: newListValues,
        node: null,
        head: { ...newListValues[0], node: node1 },
        tail: {
          ...newListValues[newListValues.length - 1],
          node: node2,
        },
        unique: newUnique,
        nodeMethod: nodeMethod,
      },
      componentsToDestroy: componentsToDestroy,
    };
  }

  function getActualListValue(value) {
    switch (typeof value) {
      case "object":
        if (!value) {
          return {
            type: NODETYPES.TEXT,
            value: "",
          };
        }
        if (value[componentsIdentifier]) {
          return {
            type: NODETYPES.COMPONENT,
            value: value[componentsIdentifier],
          };
        }
      default:
        return {
          type: NODETYPES.TEXT,
          value: "" + value,
        };
    }
  }

  function Run(This) {
    runComponentMethods(This[symbolIdentifier].id);
    return This;
  }

  function destroyComponent(componentId, destructionHead) {
    const componentObject = states[componentId];
    if (!componentObject) {
      return;
    }
    const componentObject_Internal = componentObject[symbolIdentifier];

    //If the component DOM node exists
    if (
      !componentObject_Internal.isDestroyed &&
      componentObject_Internal.domNode &&
      !componentObject_Internal.domNode.isConnected
    ) {
      if (typeof componentObject.onDetach == "function") {
        componentObject.onDetach.apply(componentObject);
      }
      if (
        componentObject_Internal.pure ||
        componentObject_Internal.killOnDetach
      ) {
        componentObject_Internal.keepNodeOnDetach = false;
        componentObject_Internal.clearAttrOnDetach = true;
        componentObject_Internal.keepStateOnDetach = false;
      }
      //If component is set to be kept even after it is detached,
      //We keep the component's data as well
      if (componentObject_Internal.keepNodeOnDetach) {
        const parent = componentObject_Internal.parent;
        if (
          destructionHead ||
          !states[parent][symbolIdentifier].keepNodeOnDetach
        ) {
          //Remove component from its parent child components
          removeFromChildComponents(componentId);
          if (componentObject_Internal.domNode.parentNode) {
            setupComponentForNewParent(componentId);
            componentObject_Internal.domNode.remove();
          }
          componentObject_Internal.firstCall = true;
          componentObject_Internal.parent = 0;
          componentObject_Internal.parentDNode = undefined;
        }

        componentObject_Internal.isDestroyed = true;
      }
      //Destroy data of component if `keepNodeOnDetach` is undefined or false
      else {
        if (componentObject_Internal.parent) {
          //Remove component from its parent child components
          removeFromChildComponents(componentId);
        }
        keyedEls = componentObject_Internal.keyedElements;
        if (keyedEls) {
          clearElementMethods(keyedEls);
          //Do not reuse elements' attributes if `clearAttrOnDetach` is set to true
          if (componentObject_Internal.clearAttrOnDetach) {
            componentObject_Internal.keyedElements = null;
          }
        }
        componentObject_Internal.dynamicNodes = null;
        //Deatach component node from its parent node if any
        if (componentObject_Internal.domNode.parentNode) {
          setupComponentForNewParent(componentId);
          var domNode = componentObject_Internal.domNode;
          componentObject_Internal.domNode = null;
          domNode.remove();
        } else {
          componentObject_Internal.domNode = null;
        }
        if (componentObject_Internal.killOnDetach) {
          states[componentId] = null;
          delete states[componentId];
          return;
        }
        var component = {};
        if (!componentObject_Internal.keepStateOnDetach) {
          componentObject.state = null;
        } else {
          component.state = componentObject.state;
        }
        componentObject.sharedState = undefined;
        var ref = {};
        ref[symbolIdentifier] = componentObject_Internal.ref;
        component[symbolIdentifier] = {
          parent: 0,
          parentDNode: undefined,
          childComponents: {},
          id: componentId,
          firstCall: false,
          sharingState: componentObject_Internal.sharingState,
          isInserted: false,
          detached: false,
          dynamicNodes: [],
          domNode: null,
          ownerPage: componentObject_Internal.ownerPage,
          keepStateOnDetach: componentObject_Internal.keepStateOnDetach,
          keepNodeOnDetach: componentObject_Internal.keepNodeOnDetach,
          clearAttrOnDetach: componentObject_Internal.clearAttrOnDetach,
          destroy: componentObject_Internal.destroy,
          isDestroyed: true,
          data: componentObject_Internal.data,
          classType: componentObject_Internal.classType,
          created: true,
          keyedElements: componentObject_Internal.keyedElements,
          ref: ref,
        };
        states[componentId] = component;
      }
    }
  }

  function clearElementMethods(keyedEls) {
    var keys = Object.keys(keyedEls),
      i = 0,
      keyedEl;
    while (i < keys.length) {
      keyedEl = keyedEls[keys[i]];
      //Remove event listeners set via addEventlistener
      removeEvents(keyedEl.element, keyedEl.eventCallers);
      //Remove methods set on element
      removeSetMethods(keyedEl.element, keyedEl.setMethods);
      keyedEl.eventCallers = null;
      keyedEl.setMethods = null;
      keyedEl.element = null;
      i++;
    }
  }

  function finalDestruction(components) {
    var head = components[0];
    for (var i = components.length - 1; i > 0; i--) {
      destroyComponent(components[i]);
    }
    destroyComponent(head, true);
  }
  function clearClonableViews() {
    var i = cloneContainer.length - 1;
    while (i > -1) {
      componentTypes[cloneContainer[i]].value = null;
      i--;
    }
    cloneContainer = [];
  }

  Breaker.ui.run = Run;
  Breaker.createText = createText;
  Breaker.createElement = createElement;
  Breaker.cloneView = cloneView;
  console.log(states);
})();
