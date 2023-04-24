
const {
  createApp,
  createComponent,
  setState,
  setStyle,
  setClass,
  render,
  xss,
} = Breaker.ui;

function UserCard() {
  this.elements = {
    backImg: {
      src: "/statics/images/lady.jpg",
      $events: {
        load: function (e, This) {
          setStyle(This, "backImg", { display: "block" });
          setStyle(This, "backImgCon", { height: "auto", maxHeight: "170px" });
        },
      },
    },
    profileImg: {
      src: "/statics/images/lady.jpg",
      $events: {
        load: function (e, This) {
          setClass(This, "profileImgCon", {
            add: ["deep-borderx2"],
            remove: ["line-border-roundx2"],
          });
          setStyle(This, "profileImg", { display: "block" });
        },
      },
    },
  };
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('div',{"class":{"line-border-round":1},"style":{"borderRadius":"30px","boxShadow":"rgba(0, 0, 0, 0.1) 0px 10px 50px","padding":"20px","width":"320px"}},null,[Breaker.createElement('div',{"key":"backImgCon","class":{"light-back":1},"style":{"height":"170px","width":"100%","overflowY":"hidden"}},th["backImgCon"],[Breaker.createElement('img',{"key":"backImg","style":{"display":"none","width":"inherit"}},th["backImg"],[],t,)],t,),Breaker.createElement('div',{"style":{"display":"flex","justifyContent":"space-between"}},null,[Breaker.createElement('div',{"style":{"display":"flex"}},null,[Breaker.createElement('div',{"key":"profileImgCon","class":{"white-back":1,"line-border-roundx2":1},"style":{"width":"60px","height":"60px","marginLeft":"10px","marginTop":"-24px","borderRadius":"50%"}},th["profileImgCon"],[Breaker.createElement('img',{"key":"profileImg","style":{"display":"none","width":"60px","height":"60px","border":"1px solid #ffffff","borderRadius":"50%"}},th["profileImg"],[],t,)],t,)],t,),Breaker.createElement('div',null,null,[Breaker.createElement('div',{"class":{"cursor":1,"deep-back-hover":1,"deep-border-hover":1},"style":{"marginTop":"6px","display":"flex","alignItems":"center","borderRadius":"10px","padding":"5px"}},null,[Breaker.createElement('svg',{"fill":"none","height":"18","viewBox":"0 0 24 24","width":"18"},null,[Breaker.createElement('path',{"d":"M12.4906 17.865L16.3555 14.0002H6.25278C5.01076 14.0002 4.00391 15.007 4.00391 16.2491V17.169C4.00391 17.7411 4.18231 18.2989 4.51427 18.7648C5.90203 20.7125 8.08402 21.7757 10.9999 21.9691C10.9958 21.7863 11.016 21.5982 11.0636 21.4078L11.5213 19.5771C11.6833 18.9291 12.0183 18.3373 12.4906 17.865ZM12.0004 2.00488C14.7618 2.00488 17.0004 4.24346 17.0004 7.00488C17.0004 9.76631 14.7618 12.0049 12.0004 12.0049C9.23894 12.0049 7.00036 9.76631 7.00036 7.00488C7.00036 4.24346 9.23894 2.00488 12.0004 2.00488ZM19.0999 12.6695L13.1974 18.5719C12.8533 18.916 12.6092 19.3472 12.4911 19.8194L12.0334 21.6501C11.8344 22.4462 12.5556 23.1674 13.3517 22.9683L15.1824 22.5106C15.6545 22.3926 16.0857 22.1485 16.4299 21.8043L22.3323 15.9019C23.2249 15.0093 23.2249 13.5621 22.3323 12.6695C21.4397 11.7768 19.9925 11.7768 19.0999 12.6695Z","fill":"#ffffff"},null,[],t,true)],t,true),Breaker.createElement('span',{"style":{"color":"#ffffff","marginLeft":"3px"}},null,[Breaker.createText("Edit")],t,)],t,)],t,)],t,),Breaker.createElement('div',{"class":{"deep-color":1},"style":{"marginTop":"10px","marginLeft":"10px","fontWeight":"bold","fontSize":"20px"}},null,[function(args){return (xss(args.fullname))}],t,),Breaker.createElement('a',{"class":{"deep-color-less":1},"href":"","style":{"marginTop":"5px","marginLeft":"10px","fontWeight":"bold","fontSize":"15px","display":"block"}},null,[Breaker.createText(" @"),function(args){return (xss(args.username))}],t,),Breaker.createElement('div',{"style":{"marginTop":"15px","marginLeft":"10px","display":"flex","justifyContent":"center","borderTop":"1px solid #ebe6e3","padding":"15px 0px","borderBottom":"1px solid #ebe6e3"}},null,[Breaker.createElement('div',{"style":{"textAlign":"center","marginRight":"15px","borderRight":"1px solid #ebe6e3","flex":"1"}},null,[Breaker.createElement('code',{"style":{"display":"block"}},null,[function(args){return (args.following)}],t,),Breaker.createElement('a',{"href":"","class":{"color":1},"style":{"fontWeight":"bold","display":"block"}},null,[Breaker.createText(" Following ")],t,)],t,),Breaker.createElement('div',{"style":{"textAlign":"center","marginLeft":"15px","flex":"1"}},null,[Breaker.createElement('code',{"style":{"display":"block"}},null,[function(args){return (args.followers)}],t,),Breaker.createElement('a',{"href":"","class":{"color":1},"style":{"fontWeight":"bold","display":"block"}},null,[Breaker.createText(" Followers ")],t,)],t,)],t,),Breaker.createElement('div',{"style":{"margin":"20px 10px"}},null,[function(args){return (Button({ title: "View profile" }))}],t,)],t,)}(this,Breaker.ui.run(this))
  );
}

UserCard = createComponent(UserCard);

function UserActionsCard() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('div',{"class":{"line-border-round":1},"style":{"borderRadius":"30px","boxShadow":"rgba(0, 0, 0, 0.1) 0px 10px 50px","padding":"20px","width":"320px","marginTop":"1rem"}},null,[function(args){return (UserAction({
            path1:
              "M15,8.7l-1.6-1.7c-2.3-2.5-6.2-2.6-8.7-0.2l0,0c-2.2,2.2-2.3,5.7-0.2,8L7,17.3l8,8.7l8-8.7l1-1.1l-8.3-8.3   L15,8.7z",
            path2:
              "M25.3,6.7L25.3,6.7c-2.4-2.4-6.4-2.2-8.7,0.2l-0.9,1l8.3,8.3l1.4-1.5C27.6,12.4,27.5,8.9,25.3,6.7z",
            actionname: "Likes",
            surface: 0,
            width: 23,
          }))},function(args){return (UserAction({
            path1:
              "M24,26H6c-2.2,0-4-1.8-4-4v-9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4v9C28,24.2,26.2,26,24,26z",
            path2:
              "M13.1,4H6C3.8,4,2,5.8,2,8v14c0,2.2,1.8,4,4,4h18c0.5,0,0.9-0.1,1.3-0.2L13.1,4z",
            actionname: "Bookmarks",
            surface: 1,
            width: 20,
          }))},function(args){return (UserAction(
            {
              path1:
                "M44.525,20.734c0-6.919-5.608-12.527-12.528-12.527s-12.527,5.608-12.527,12.527c0,9.913,12.527,24.581,12.527,24.581   S44.525,30.596,44.525,20.734z M25.819,19.986c0-3.413,2.767-6.179,6.179-6.179c3.412,0,6.179,2.766,6.179,6.179   c0,3.413-2.767,6.179-6.179,6.179C28.586,26.165,25.819,23.399,25.819,19.986z",
              path2:
                "M39.08,40.958c-1.021,1.475-1.979,2.761-2.777,3.793c7.916,0.475,13.104,2.184,15.034,3.456   c-2.261,1.491-8.98,3.587-19.338,3.587c-10.358,0-17.077-2.097-19.338-3.587c1.93-1.271,7.114-2.979,15.022-3.455   c-0.8-1.032-1.759-2.317-2.781-3.792c-9.741,0.959-16.816,3.841-16.816,7.246c0,4.19,10.707,7.588,23.913,7.588   c13.207,0,23.912-3.397,23.912-7.588C55.913,44.799,48.83,41.916,39.08,40.958z",
              actionname: "Your Circle",
              surface: 0,
              width: 27,
            },
            { "enable-background": "new 0 0 64 64", viewBox: "0 0 64 64" },
            true
          ))}],t,)}(this,Breaker.ui.run(this))
  );
}
function UserAction({ path1, path2, surface, width }, attributes, leaveMargin) {
  this.elements = {
    svg: {
      style: {
        width: (width = width + "px"),
        height: width,
        marginLeft: leaveMargin ? "-5px" : "0px",
      },
      ...(attributes || {}),
    },
    path1: {
      d: path1,
      class: !surface ? "st111" : "st12",
    },
    path2: {
      d: path2,
      class: surface ? "st111" : "st12",
    },
    name: leaveMargin
      ? {
          style: {
            marginLeft: "0px",
          },
        }
      : {},
  };
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('button',{"class":{"back-hover":1,"cursor":1,"white-back":1},"style":{"borderRadius":"30px","padding":"7px 5px 10px 10px","display":"block","border":"none","width":"100%","alignItems":"center"}},null,[Breaker.createElement('div',{"style":{"marginTop":"10px","display":"flex","alignItems":"center","borderRadiu":"10px","padding":"5px","borde":"2px solid #f95603","backgroundColo":"#f95603"}},null,[Breaker.createElement('svg',{"key":"svg","id":"Layer_1","style":{"enableBackground":"new 0 0 30 30"},"version":"1.1","viewBox":"0 0 30 30","xml:space":"preserve","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","width":"20","height":"20","aria-hidden":true},th["svg"],[Breaker.createElement('g',null,null,[Breaker.createElement('path',{"key":"path1"},th["path1"],[],t,true)],t,true),Breaker.createElement('path',{"key":"path2"},th["path2"],[],t,true)],t,true),Breaker.createElement('span',{"key":"name","style":{"marginLeft":"3px","fontSize":"18px","fontWeight":"bold"}},th["name"],[function(args){return (args.actionname)}],t,)],t,)],t,)}(this,Breaker.ui.run(this))
  );
}

UserAction = createComponent(UserAction);
UserActionsCard = createComponent(UserActionsCard);

function Button() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('button',{"key":"main","class":{"cursor":1,"deep-back-hover":1,"deep-border-hover":1},"style":{"borderRadius":"10px","padding":"9px","color":"#ffffff","textAlign":"center","display":"block","width":"100%","fontSize":"17px"}},th["main"],[function(args){return (args.title)}],t,)}(this,Breaker.ui.run(this))
  );
}

Button = createComponent(Button);

function NavigationLink() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('a',{"href":"","class":{"deep-color":1,"back-hover":1},"style":{"display":"flex","fontSize":"18px","fontWeight":"bold","padding":"15px 15px 15px 20px","textAlign":"left","borderRadius":"30px","alignItems":"center"}},null,[function(args){return (args.icon())},Breaker.createElement('span',{"style":{"marginLeft":"10px"}},null,[function(args){return (args.title)}],t,)],t,)}(this,Breaker.ui.run(this))
  );
}
NavigationLink = createComponent(NavigationLink);

function TopicsLink() {
  this.elements = {
    image1: {
      src: "/statics/images/lady.jpg",
      $events: {
        load: function OnLoad(e, This) {
          setStyle(This, "image1", { display: "block" });
        },
      },
    },
    image2: {
      src: "/statics/images/cat.jpg",
      $events: {
        load: function OnLoad(e, This) {
          setStyle(This, "image2", { display: "block" });
        },
      },
    },
    image3: {
      src: "/statics/images/lady.jpg",
      $events: {
        load: function OnLoad(e, This) {
          setStyle(This, "image3", { display: "block" });
        },
      },
    },
  };
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('button',{"class":{"line-border-bottom":1,"light-hover-less":1,"cursor":1,"transparent":1},"style":{"padding":"10px","borderRadius":"4px","width":"100%","border":"none","textAlign":"left","borderBottom":"1px solid #ebe6e3","display":"block"}},null,[Breaker.createElement('div',{"class":{"deep-color-less":1},"style":{"fontWeight":"bold","fontSize":"18px","margin":"5px 0px 10px 0px"}},null,[function(args){return (xss(args.title))}],t,),Breaker.createElement('div',{"style":{"display":"flex","justifyContent":"space-between"}},null,[Breaker.createElement('div',{"style":{"display":"flex","alignItems":"center"}},null,[Breaker.createElement('div',{"class":{"line-border-roundx2":1,"light-back":1},"style":{"width":"30px","height":"28px","borderRadius":"50%"}},null,[Breaker.createElement('img',{"key":"image1","style":{"display":"none","width":"30px","height":"28px","borderRadius":"50%"},"aria-hidden":true},th["image1"],[],t,)],t,),Breaker.createElement('div',{"class":{"line-border-roundx2":1,"light-back":1},"style":{"width":"30px","height":"28px","borderRadius":"50%","marginLeft":"-25px"}},null,[Breaker.createElement('img',{"key":"image2","style":{"display":"none","width":"30px","height":"28px","borderRadius":"50%"},"aria-hidden":true},th["image2"],[],t,)],t,),Breaker.createElement('div',{"class":{"line-border-roundx2":1,"light-back":1},"style":{"width":"28px","height":"28px","borderRadius":"50%","marginLeft":"-25px"}},null,[Breaker.createElement('img',{"key":"image3","style":{"display":"none","width":"28px","height":"28px","borderRadius":"50%"}},th["image3"],[],t,)],t,),Breaker.createElement('div',{"aria-hidden":true,"class":{"line-color":1},"style":{"marginLeft":"20px","fontSize":"15px"}},null,[Breaker.createText(" and many more ")],t,)],t,),Breaker.createElement('div',{"style":{"margin":"0px 10px"}},null,[function(args){return (Button({ title: "Follow" }))}],t,)],t,)],t,)}(this,Breaker.ui.run(this))
  );
}

TopicsLink = createComponent(TopicsLink);

function App() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('div',{"style":{"display":"flex","justifyContent":"space-between"}},null,[Breaker.createElement('div',null,null,[function(args){return (UserCard({
              username: "KBismark_",
              fullname: "Bismark Yamoah",
              location: "Accra-Ghana, Africa",
              bio: "Programming💻💻 is life🤝",
              followers: 1045,
              following: 2354,
            }))},function(args){return (UserActionsCard())}],t,),Breaker.createElement('div',null,null,[Breaker.createElement('nav',{"class":{"line-border-round":1},"style":{"padding":"20px","width":"300px","marginTop":"1rem"}},null,[function(args){return (NavigationLink({
                title: "Home",
                icon: () => HomeSolid({ size: 28, color: "#302e2d" }),
              }))},function(args){return (NavigationLink({
                title: "Projects",
                icon: () => PuzzleSolid({ size: 31, color: "#302e2d" }),
              }))},function(args){return (NavigationLink({
                title: "Communities",
                icon: () => GroupSolid({ size: 30, color: "#302e2d" }),
                adjust: true,
              }))},Breaker.createElement('div',{"class":{"line-border-top":1},"style":{"marginTop":"20px","padding":"5px","fontSize":"14px"}},null,[Breaker.createElement('a',{"href":"","class":{"page-color":1},"style":{"margin":"5px"}},null,[Breaker.createText(" About ")],t,),Breaker.createElement('a',{"href":"","class":{"page-color":1},"style":{"margin":"5px"}},null,[Breaker.createText(" Privacy ")],t,),Breaker.createElement('a',{"href":"","class":{"page-color":1},"style":{"margin":"5px"}},null,[Breaker.createText(" Terms and Conditions ")],t,)],t,)],t,),function(args){return (AccountSuggestion())},function(args){return (TopicsSuggestion())}],t,)],t,)}(this,Breaker.ui.run(this))
  );
}

App = createComponent(App);

function AccountsLink() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('div',{"class":{"fake-button":1,"line-border-bottom":1,"cursor":1,"light-hover":1,"transparent":1},"style":{"padding":"7px 10px","borderRadius":"4px","width":"100%","justifyContent":"space-between","display":"flex","alignItems":"center"}},null,[Breaker.createElement('div',{"style":{"display":"flex","alignItems":"center"}},null,[Breaker.createElement('div',null,null,[Breaker.createElement('div',{"key":"profileImgCon","class":{"light-back":1,"line-border-roundx2":1},"style":{"width":"50px","height":"50px","borderRadius":"50%"}},th["profileImgCon"],[Breaker.createElement('img',{"key":"profileImg","style":{"display":"none","width":"60px","height":"60px","border":"1px solid #ffffff","borderRadius":"50%"}},th["profileImg"],[],t,)],t,)],t,),Breaker.createElement('div',{"style":{"marginLeft":"10px"}},null,[Breaker.createElement('div',{"class":{"deep-color":1},"style":{"marginTop":"10px","marginLeft":"10px","fontWeight":"bold","fontSize":"16px"}},null,[function(args){return (xss(args.fullname))}],t,),Breaker.createElement('a',{"class":{"deep-color-less":1},"href":"","style":{"marginTop":"5px","marginLeft":"10px","fontSize":"15px","display":"block"}},null,[Breaker.createText(" @"),function(args){return (xss(args.username))}],t,)],t,)],t,),Breaker.createElement('div',{"style":{"marginLeft":"5px"}},null,[function(args){return (Button({ title: "Follow" }))}],t,)],t,)}(this,Breaker.ui.run(this))
  );
}
AccountsLink = createComponent(AccountsLink);
function AccountSuggestion() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('div',{"class":{"transparent":1},"style":{"padding":"20px 0px","width":"340px","marginTop":"1rem"}},null,[Breaker.createElement('h2',{"class":{"deep-color":1},"style":{"fontSize":"24px","margin":"5px 10px 20px 10px","fontWeight":"bold"}},null,[Breaker.createText(" Connect with others ")],t,),function(args){return (AccountsLink({ fullname: "Bismark Yamoah", username: "KBismark_" }))},function(args){return (AccountsLink({ fullname: "Abigail Twumasi", username: "abi_twum" }))},function(args){return (AccountsLink({
            fullname: "John Turkson Emmanuel",
            username: "jonnie1_uk",
          }))},Breaker.createElement('a',{"href":"","class":{"page-color":1},"style":{"padding":"15px 10px","fontSize":"15px"}},null,[Breaker.createText(" See more accounts ")],t,)],t,)}(this,Breaker.ui.run(this))
  );
}
AccountSuggestion = createComponent(AccountSuggestion);

function TopicsSuggestionSkeleton() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('div',{"class":{"light-back":1,"line-border-round":1},"style":{"padding":"20px","width":"340px","marginTop":"1rem"}},null,[Breaker.createElement('h2',{"class":{"deep-color":1},"style":{"textAlign":"center","fontSize":"24px","margin":"5px 10px 20px 10px","fontWeight":"bold"}},null,[Breaker.createText(" Topics ")],t,),Breaker.createElement('div',{"class":{"line-border-bottom":1,"cursor":1,"transparent":1},"style":{"padding":"7px 10px","borderRadius":"4px","width":"100%"}},null,[Breaker.createElement('div',{"style":{"borderRadius":"15px","padding":"7px 0px","backgroundColor":"rgba(0,0,0,0.1)","width":"80%","margin":"15px 10px 15px 0px"}},null,[],t,),Breaker.createElement('div',{"style":{"borderRadius":"15px","padding":"7px 0px","backgroundColor":"rgba(0,0,0,0.1)","width":"70%","margin":"15px 10px 15px 0px"}},null,[],t,)],t,),Breaker.createElement('div',{"class":{"line-border-bottom":1,"cursor":1,"transparent":1},"style":{"padding":"7px 10px","borderRadius":"4px","width":"100%"}},null,[Breaker.createElement('div',{"style":{"borderRadius":"15px","padding":"7px 0px","backgroundColor":"rgba(0,0,0,0.1)","width":"80%","margin":"15px 10px 15px 0px"}},null,[],t,),Breaker.createElement('div',{"style":{"borderRadius":"15px","padding":"7px 0px","backgroundColor":"rgba(0,0,0,0.1)","width":"70%","margin":"15px 10px 15px 0px"}},null,[],t,)],t,),Breaker.createElement('div',{"class":{"line-border-bottom":1,"cursor":1,"transparent":1},"style":{"padding":"7px 10px","borderRadius":"4px","width":"100%"}},null,[Breaker.createElement('div',{"style":{"borderRadius":"15px","padding":"7px 0px","backgroundColor":"rgba(0,0,0,0.1)","width":"80%","margin":"15px 10px 15px 0px"}},null,[],t,),Breaker.createElement('div',{"style":{"borderRadius":"15px","padding":"7px 0px","backgroundColor":"rgba(0,0,0,0.1)","width":"70%","margin":"15px 10px 15px 0px"}},null,[],t,)],t,)],t,)}(this,Breaker.ui.run(this))
  );
}
TopicsSuggestionSkeleton = createComponent(TopicsSuggestionSkeleton);
function TopicsSuggestion() {
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('div',{"class":{"light-back":1,"line-border-round":1},"style":{"padding":"20px","width":"340px","marginTop":"1rem"}},null,[Breaker.createElement('h2',{"class":{"deep-color":1},"style":{"textAlign":"center","fontSize":"24px","margin":"5px 10px 20px 10px","fontWeight":"bold"}},null,[Breaker.createText(" Topics ")],t,),function(args){return (TopicsLink({ title: "Web development" }))},function(args){return (TopicsLink({
            title: "Computer Science and Programming Languages",
          }))},function(args){return (TopicsLink({ title: "Technology and Science" }))},Breaker.createElement('a',{"href":"","class":{"page-color":1},"style":{"padding":"15px 10px","fontSize":"15px"}},null,[Breaker.createText(" View more topics ")],t,)],t,)}(this,Breaker.ui.run(this))
  );
}
TopicsSuggestion = createComponent(TopicsSuggestion);

function HomeSolid({ size, color }) {
  this.elements = {
    icon: {
      style: {
        width: (size = size + "px"),
        height: size,
      },
    },
    path: {
      style: {
        fill: color,
      },
    },
  };
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('svg',{"style":{"enableBackground":"new 0 0 24 24"},"version":"1.1","viewBox":"0 0 24 24","xml:space":"preserve","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","width":"24","height":"24","key":"icon"},th["icon"],[Breaker.createElement('g',null,null,[],t,true),Breaker.createElement('g',null,null,[Breaker.createElement('path',{"key":"path","fill":"#302e2d","d":"M23.6,10.3L13.2,2.4c-0.7-0.5-1.7-0.5-2.5,0L0.4,10.3C-0.4,10.9,0,12,1,12h1v6.1C2,20.2,3.8,22,6,22h2 c0.6,0,1-0.4,1-1v-4.9C9,15,9.9,14,11,14h2c1.1,0,2,1,2,2.1V21c0,0.5,0.4,1,1,1h2c2.2,0,4-1.8,4-3.9V12h1 C23.9,12,24.3,10.9,23.6,10.3z"},th["path"],[],t,true)],t,true)],t,true)}(this,Breaker.ui.run(this))
  );
}
HomeSolid = createComponent(HomeSolid);

//Fluent solid 24px - iconfinder.com

function PuzzleSolid({ size, color }) {
  const d =
    "M13 2a2.47 2.47 0 0 1 2.47 2.47l-.001.53H19a1 1 0 0 1 1 1l-.001 3.499-1.53.001a2.47 2.47 0 0 0-2.464 2.307L16 11.97v.06a2.47 2.47 0 0 0 2.307 2.465l.163.005 1.529-.001.001 3.504a1 1 0 0 1-1 1l-3.531-.001v.528a2.47 2.47 0 1 1-4.939 0v-.528H7a1 1 0 0 1-1-1l-.001-3.531h-.53a2.47 2.47 0 0 1 0-4.94H6L6 6a1 1 0 0 1 1-1h3.53v-.53A2.47 2.47 0 0 1 13 2Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function Puzzle2Solid({ size, color }) {
  const d =
    "M512 288c0 35.35-21.49 64-48 64c-32.43 0-31.72-32-55.64-32C394.9 320 384 330.9 384 344.4V480c0 17.67-14.33 32-32 32h-71.64C266.9 512 256 501.1 256 487.6C256 463.1 288 464.4 288 432c0-26.51-28.65-48-64-48s-64 21.49-64 48c0 32.43 32 31.72 32 55.64C192 501.1 181.1 512 167.6 512H32c-17.67 0-32-14.33-32-32v-135.6C0 330.9 10.91 320 24.36 320C48.05 320 47.6 352 80 352C106.5 352 128 323.3 128 288S106.5 223.1 80 223.1c-32.43 0-31.72 32-55.64 32C10.91 255.1 0 245.1 0 231.6v-71.64c0-17.67 14.33-31.1 32-31.1h135.6C181.1 127.1 192 117.1 192 103.6c0-23.69-32-23.24-32-55.64c0-26.51 28.65-47.1 64-47.1s64 21.49 64 47.1c0 32.43-32 31.72-32 55.64c0 13.45 10.91 24.36 24.36 24.36H352c17.67 0 32 14.33 32 31.1v71.64c0 13.45 10.91 24.36 24.36 24.36c23.69 0 23.24-32 55.64-32C490.5 223.1 512 252.7 512 288z";
  return CommonSolids({
    size,
    iconProps: { viewBox: "0 0 512 512" },
    pathProps: { d, style: { fill: color } },
  });
}
function GroupSolid({ size, color }) {
  const d =
    "M14.75 15C15.7165 15 16.5 15.7835 16.5 16.75L16.4989 17.7121C16.6156 19.9012 14.9879 21.009 12.0668 21.009C9.15786 21.009 7.5 19.9192 7.5 17.75V16.75C7.5 15.7835 8.2835 15 9.25 15H14.75ZM3.75 10L8.126 10.0001C8.04375 10.3197 8 10.6547 8 11C8 12.1155 8.45665 13.1244 9.1932 13.8499L9.35526 14.001L9.25 14C8.94865 14 8.65863 14.0485 8.38729 14.138C7.52255 14.4235 6.84765 15.1264 6.60122 16.0082L6.56679 16.009C3.65786 16.009 2 14.9192 2 12.75V11.75C2 10.7835 2.7835 10 3.75 10ZM20.25 10C21.2165 10 22 10.7835 22 11.75L21.9989 12.7121C22.1156 14.9012 20.4879 16.009 17.5668 16.009L17.3985 16.0073C17.1596 15.1534 16.5188 14.4673 15.6929 14.1659C15.4576 14.08 15.2073 14.0254 14.947 14.0069L14.75 14L14.6447 14.001C15.4758 13.268 16 12.1952 16 11C16 10.6547 15.9563 10.3197 15.874 10.0001L20.25 10ZM12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8ZM6.5 3C8.15685 3 9.5 4.34315 9.5 6C9.5 7.65685 8.15685 9 6.5 9C4.84315 9 3.5 7.65685 3.5 6C3.5 4.34315 4.84315 3 6.5 3ZM17.5 3C19.1569 3 20.5 4.34315 20.5 6C20.5 7.65685 19.1569 9 17.5 9C15.8431 9 14.5 7.65685 14.5 6C14.5 4.34315 15.8431 3 17.5 3Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function UserSearchSolid({ size, color }) {
  const d =
    "M11.9092 13.9994L19.7531 13.9997C20.9957 13.9997 22.0031 15.0071 22.0031 16.2497V17.1548C22.0031 18.2484 21.5256 19.2876 20.6958 20C19.1303 21.344 16.89 22.0008 14 22.0008L13.821 21.9997C14.1231 21.3912 14.0492 20.6435 13.5995 20.1033L13.489 19.9824L11.2591 17.7585C11.7394 16.9314 12 15.9849 12 14.9998C12 14.6581 11.9689 14.3238 11.9092 13.9994ZM6.5 10.4998C8.98528 10.4998 11 12.5145 11 14.9998C11 16.0936 10.6097 17.0962 9.96089 17.8761L12.7827 20.6904C13.076 20.9829 13.0766 21.4578 12.784 21.751C12.5181 22.0176 12.1014 22.0423 11.8076 21.8248L11.7234 21.7523L8.82025 18.8563C8.14274 19.2648 7.34881 19.4998 6.5 19.4998C4.01472 19.4998 2 17.4851 2 14.9998C2 12.5145 4.01472 10.4998 6.5 10.4998ZM6.5 11.9998C4.84315 11.9998 3.5 13.3429 3.5 14.9998C3.5 16.6566 4.84315 17.9998 6.5 17.9998C8.15685 17.9998 9.5 16.6566 9.5 14.9998C9.5 13.3429 8.15685 11.9998 6.5 11.9998ZM14 2.00439C16.7614 2.00439 19 4.24297 19 7.00439C19 9.76582 16.7614 12.0044 14 12.0044C11.2386 12.0044 9 9.76582 9 7.00439C9 4.24297 11.2386 2.00439 14 2.00439Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function UserSearchSolid({ size, color }) {
  const d =
    "M11.9092 13.9994L19.7531 13.9997C20.9957 13.9997 22.0031 15.0071 22.0031 16.2497V17.1548C22.0031 18.2484 21.5256 19.2876 20.6958 20C19.1303 21.344 16.89 22.0008 14 22.0008L13.821 21.9997C14.1231 21.3912 14.0492 20.6435 13.5995 20.1033L13.489 19.9824L11.2591 17.7585C11.7394 16.9314 12 15.9849 12 14.9998C12 14.6581 11.9689 14.3238 11.9092 13.9994ZM6.5 10.4998C8.98528 10.4998 11 12.5145 11 14.9998C11 16.0936 10.6097 17.0962 9.96089 17.8761L12.7827 20.6904C13.076 20.9829 13.0766 21.4578 12.784 21.751C12.5181 22.0176 12.1014 22.0423 11.8076 21.8248L11.7234 21.7523L8.82025 18.8563C8.14274 19.2648 7.34881 19.4998 6.5 19.4998C4.01472 19.4998 2 17.4851 2 14.9998C2 12.5145 4.01472 10.4998 6.5 10.4998ZM6.5 11.9998C4.84315 11.9998 3.5 13.3429 3.5 14.9998C3.5 16.6566 4.84315 17.9998 6.5 17.9998C8.15685 17.9998 9.5 16.6566 9.5 14.9998C9.5 13.3429 8.15685 11.9998 6.5 11.9998ZM14 2.00439C16.7614 2.00439 19 4.24297 19 7.00439C19 9.76582 16.7614 12.0044 14 12.0044C11.2386 12.0044 9 9.76582 9 7.00439C9 4.24297 11.2386 2.00439 14 2.00439Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function TeamSolid({ size, color }) {
  const d =
    "M14.754 10C15.7205 10 16.504 10.7835 16.504 11.75V16.499C16.504 18.9848 14.4888 21 12.003 21C9.51712 21 7.50193 18.9848 7.50193 16.499V11.75C7.50193 10.7835 8.28543 10 9.25193 10H14.754ZM7.13128 9.99906C6.78183 10.4218 6.55636 10.9508 6.51057 11.5304L6.50193 11.75V16.499C6.50193 17.3456 6.69319 18.1476 7.03487 18.864C6.70577 18.953 6.35899 19 6.00124 19C3.79142 19 2 17.2086 2 14.9988V11.75C2 10.8318 2.70711 10.0788 3.60647 10.0058L3.75 10L7.13128 9.99906ZM16.8747 9.99906L20.25 10C21.2165 10 22 10.7835 22 11.75V15C22 17.2091 20.2091 19 18 19C17.6436 19 17.298 18.9534 16.9691 18.8659C17.2697 18.238 17.4538 17.5452 17.4951 16.8144L17.504 16.499V11.75C17.504 11.0847 17.2678 10.4747 16.8747 9.99906ZM12 3C13.6569 3 15 4.34315 15 6C15 7.65685 13.6569 9 12 9C10.3431 9 9 7.65685 9 6C9 4.34315 10.3431 3 12 3ZM18.5 4C19.8807 4 21 5.11929 21 6.5C21 7.88071 19.8807 9 18.5 9C17.1193 9 16 7.88071 16 6.5C16 5.11929 17.1193 4 18.5 4ZM5.5 4C6.88071 4 8 5.11929 8 6.5C8 7.88071 6.88071 9 5.5 9C4.11929 9 3 7.88071 3 6.5C3 5.11929 4.11929 4 5.5 4Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function UserSolid({ size, color }) {
  const d =
    "M17.7543 13.9997C18.9963 13.9997 20.0032 15.0065 20.0032 16.2486V17.167C20.0032 17.7404 19.8239 18.2994 19.4906 18.7659C17.9447 20.9292 15.4204 22.0008 12.0001 22.0008C8.57915 22.0008 6.05619 20.9287 4.51403 18.7643C4.18207 18.2984 4.00366 17.7406 4.00366 17.1685V16.2486C4.00366 15.0065 5.01052 13.9997 6.25254 13.9997H17.7543ZM12.0001 2.00439C14.7615 2.00439 17.0001 4.24297 17.0001 7.00439C17.0001 9.76582 14.7615 12.0044 12.0001 12.0044C9.2387 12.0044 7.00012 9.76582 7.00012 7.00439C7.00012 4.24297 9.2387 2.00439 12.0001 2.00439Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function UserEditSolid({ size, color }) {
  const d =
    "M12.4906 17.865L16.3555 14.0002H6.25278C5.01076 14.0002 4.00391 15.007 4.00391 16.2491V17.169C4.00391 17.7411 4.18231 18.2989 4.51427 18.7648C5.90203 20.7125 8.08402 21.7757 10.9999 21.9691C10.9958 21.7863 11.016 21.5982 11.0636 21.4078L11.5213 19.5771C11.6833 18.9291 12.0183 18.3373 12.4906 17.865ZM12.0004 2.00488C14.7618 2.00488 17.0004 4.24346 17.0004 7.00488C17.0004 9.76631 14.7618 12.0049 12.0004 12.0049C9.23894 12.0049 7.00036 9.76631 7.00036 7.00488C7.00036 4.24346 9.23894 2.00488 12.0004 2.00488ZM19.0999 12.6695L13.1974 18.5719C12.8533 18.916 12.6092 19.3472 12.4911 19.8194L12.0334 21.6501C11.8344 22.4462 12.5556 23.1674 13.3517 22.9683L15.1824 22.5106C15.6545 22.3926 16.0857 22.1485 16.4299 21.8043L22.3323 15.9019C23.2249 15.0093 23.2249 13.5621 22.3323 12.6695C21.4397 11.7768 19.9925 11.7768 19.0999 12.6695Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function MegaphoneSolid({ size, color }) {
  const d =
    "M21.9068 5.62236C21.9686 5.83039 22 6.04627 22 6.26329V17.7387C22 18.9813 20.9926 19.9887 19.75 19.9887C19.5329 19.9887 19.317 19.9573 19.1089 19.8954L13.595 18.2558C12.9378 19.6008 11.5584 20.4994 10 20.4994C7.8578 20.4994 6.10892 18.8155 6.0049 16.6991L6 16.4994L5.999 15.9987L3.60891 15.288C2.65446 15.0043 2 14.127 2 13.1313V10.8693C2 9.87356 2.65455 8.99622 3.60908 8.71256L19.1091 4.1065C20.3002 3.75253 21.5528 4.4312 21.9068 5.62236ZM7.499 16.4447L7.5 16.4994C7.5 17.8801 8.61929 18.9994 10 18.9994C10.8852 18.9994 11.6783 18.5352 12.1238 17.82L7.499 16.4447Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}
function Megaphone2Solid({ size, color }) {
  const d =
    "M17.2117 2.23726C17.3427 1.84432 17.1304 1.41955 16.7375 1.28851C16.3445 1.15747 15.9198 1.36978 15.7887 1.76272L15.0387 4.01171C14.9077 4.40465 15.12 4.82941 15.5129 4.96045C15.9059 5.09149 16.3306 4.87918 16.4617 4.48624L17.2117 2.23726ZM21.7803 2.21967C22.0732 2.51256 22.0732 2.98744 21.7803 3.28033L19.2803 5.78033C18.9874 6.07322 18.5126 6.07322 18.2197 5.78033C17.9268 5.48744 17.9268 5.01256 18.2197 4.71967L20.7197 2.21967C21.0126 1.92678 21.4874 1.92678 21.7803 2.21967ZM12.8706 3.74087C11.7547 2.54545 9.78611 2.84497 9.07629 4.31816L3.17848 16.5588C2.83795 17.2655 2.99437 18.1114 3.56513 18.6497L5.00386 20.0065C5.53118 20.5037 6.30531 20.6362 6.96799 20.3426L8.38545 19.7146C9.0275 21.0658 10.4048 22 12.0003 22C14.2095 22 16.0003 20.2091 16.0003 18C16.0003 17.4597 15.8932 16.9445 15.6991 16.4743L19.119 14.9591C20.5809 14.3115 20.9679 12.4157 19.8769 11.2469L12.8706 3.74087ZM14.3266 17.0824C14.4387 17.3665 14.5003 17.6761 14.5003 18C14.5003 19.3807 13.3811 20.5 12.0003 20.5C11.0169 20.5 10.1662 19.9322 9.75795 19.1066L14.3266 17.0824ZM19 8.24927C19 7.83505 19.3358 7.49927 19.75 7.49927H21.75C22.1642 7.49927 22.5 7.83505 22.5 8.24927C22.5 8.66348 22.1642 8.99927 21.75 8.99927H19.75C19.3358 8.99927 19 8.66348 19 8.24927Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}

function GroupAddSolid({ size, color }) {
  const d =
    "M17.5 12C20.5376 12 23 14.4624 23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12ZM17.5 13.9992L17.4101 14.0073C17.206 14.0443 17.0451 14.2053 17.0081 14.4094L17 14.4992L16.9996 16.9992L14.4977 17L14.4078 17.0081C14.2037 17.0451 14.0427 17.206 14.0057 17.4101L13.9977 17.5L14.0057 17.5899C14.0427 17.794 14.2037 17.9549 14.4078 17.9919L14.4977 18L17.0007 17.9992L17.0011 20.5035L17.0092 20.5934C17.0462 20.7975 17.2071 20.9584 17.4112 20.9954L17.5011 21.0035L17.591 20.9954C17.7951 20.9584 17.956 20.7975 17.9931 20.5934L18.0011 20.5035L18.0007 17.9992L20.5046 18L20.5944 17.9919C20.7985 17.9549 20.9595 17.794 20.9965 17.5899L21.0046 17.5L20.9965 17.4101C20.9595 17.206 20.7985 17.0451 20.5944 17.0081L20.5046 17L17.9996 16.9992L18 14.4992L17.9919 14.4094C17.9549 14.2053 17.794 14.0443 17.5899 14.0073L17.5 13.9992ZM12.0219 13.9998C11.375 15.0101 11 16.2113 11 17.5C11 18.3838 11.1764 19.2264 11.4959 19.9946C8.94206 19.8573 7.5 18.7731 7.5 16.75V15.75C7.5 14.7835 8.2835 14 9.25 14L12.0219 13.9998ZM8.126 9.00008C8.04375 9.31968 8 9.65473 8 10C8 11.1155 8.45665 12.1244 9.1932 12.8499L9.35526 13.001L9.25 13C8.94865 13 8.65863 13.0485 8.38729 13.138C7.52255 13.4235 6.84765 14.1264 6.60122 15.0082L6.56679 15.009C3.65786 15.009 2 13.9192 2 11.75V10.75C2 9.83183 2.70711 9.07881 3.60647 9.0058L3.75 9L8.126 9.00008ZM12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7ZM20.25 9C21.2165 9 22 9.7835 22 10.75L21.9989 11.7121C22.0186 12.0809 21.9887 12.4191 21.9115 12.7264C20.7518 11.6544 19.2023 11 17.5 11C16.9147 11 16.3475 11.0774 15.808 11.2224C15.9331 10.8383 16 10.4269 16 10C16 9.65473 15.9563 9.31968 15.874 9.00008L20.25 9ZM6.5 2C8.15685 2 9.5 3.34315 9.5 5C9.5 6.65685 8.15685 8 6.5 8C4.84315 8 3.5 6.65685 3.5 5C3.5 3.34315 4.84315 2 6.5 2ZM17.5 2C19.1569 2 20.5 3.34315 20.5 5C20.5 6.65685 19.1569 8 17.5 8C15.8431 8 14.5 6.65685 14.5 5C14.5 3.34315 15.8431 2 17.5 2Z";
  return CommonSolids({
    size,
    iconProps: { style: { fill: "none" } },
    pathProps: { d, style: { fill: color } },
  });
}

function CommonSolids({ size, iconProps, pathProps }) {
  iconProps.style = {
    ...(iconProps.style || {}),
    width: (size = size + "px"),
    height: size,
  };

  this.elements = {
    icon: iconProps,
    path: pathProps,
  };
  return (
    function(t){var th = t.elements || {};return Breaker.createElement('svg',{"key":"icon","width":"24","height":"24","viewBox":"0 0 24 24","xmlns":"http://www.w3.org/2000/svg"},th["icon"],[Breaker.createElement('path',{"key":"path","fill":"#302e2d"},th["path"],[],t,true)],t,true)}(this,Breaker.ui.run(this))
  );
}
CommonSolids = createComponent(CommonSolids);

createApp(
  "/",
  App.getInstanceRef(),
  function (s) {
    return s();
  },
  document.getElementById("page")
);
