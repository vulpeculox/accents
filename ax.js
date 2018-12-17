//  *IMPORTANT*
//  THIS FILE MUST BE ENCODED IN UTF-8.   (If you're not sure what that is then do not touch!)
//  Version information in .About() method


var ax = {
  
  // Returns description, version etc.
  About : function(){
    var desc = "• AX is a method for obtaining accents or other unusual characters always using the same key.  This makes it simple to explain and universal in application.";
    
    var website = "\n• The master web site is at vulpeculox.net/ax.  Contact details there.  Also on github.";
    
    var ver = "\n• This version is dated 13th Dec 2018";
    
    var licence = "\n• Licence : MIT Go ahead!  Use it, hack it.";
    
    var author = "\n• Author: Peter Fox, Witham, England";
    
    var editYourself = "\n• Please note that if you want new cycles then you'll have to do the editing yourself, or get someone with a text editor capable of UTF-8 to do it.  If you think the cycle will be of use to others then please email this file to ax@vulpeculox.net *AS AN ATTACHMENT*";
    return desc + ver + website + licence + author + editYourself;
  },    
    
  
  // Will be set to true when we have a working cycle
  _initialised : false,
    
  // Make sure we've got some cycles loaded  
  _Initialise : function(){
    if(ax._initialised){return true;}
    if(! ax.LoadCfg()){ax.SetCycle('EuropeanCombo',true);}    
  },  
  
  _helpLang : "",  
    
  // Returns a string explaining simply what to do
  // See .helpTexts for available languages  
  // Note  {HelpLang} has no connection with the language selected
  //       for accenting in SetLanguage()
  // {Force} overrides any local setting
  GetUserHelp : function(HelpLang,Force){
    // there may be nothing to do if we already have a helpLang
    // specified and we're not forcing it.
    var f = Force || false;
    if(ax._helpLang !==''){
      if(!f){return;}
    }
    
    // tidy-up input arg
    var lang = HelpLang;
    if(! ax._helpTexts.hasOwnProperty(lang)){lang = 'en';}
    var raw  = ax._helpTexts[lang].howto;
    ax._helpLang=lang;
    ax._SaveCfg();
    return raw.replace('*KEY*',ax._triggerKey);
  },
  
  _currentCycle : "",    // will be filled with a cycle
  _currentCycleName : "",    // will be filled with a cycle name
  
  // This sets the accenting cycle to be used
  // See .cycles for available values of {CycleLang}
  // or get a live list by calling AvailableCycles()
  // Returns either string of accents or false
  // If false is returned then EuropeanCombo will be used
  // {Force} overrides any local setting
  SetCycle : function(CycleLang,Force){
    // there may be nothing to do if we already have a helpLang
    // specified and we're not forcing it.
    var f = Force || false;
    if(ax._currentCycle !==''){
      if(!f){return;}
    }
    if(ax._cycles.hasOwnProperty(CycleLang)){
      ax._UseCycle(CycleLang);
      return ax.GetCycle();
    }else{
      ax._UseCycle("EuropeanCombo");
      return false;
    }
  },

  // The default is 'F8' and should only be changed
  // if absolutely necessary. Normally leave alone!
  SetTriggerKey : function(Key){
    ax._triggerKey = Key;
    ax._SaveCfg();
  },  
    
  // Get ready to use cycle specified by {Lang}
  _UseCycle : function(Lang){
    ax._currentCycle = ax._cycles[Lang];
    ax._currentCycleName = Lang;
    ax._SaveCfg();
    ax._initialised = true;
  },    

  // put state of settings to local storage
  _SaveCfg : function(){
    localStorage.setItem('ax_helpLang',ax._helpLang);
    localStorage.setItem('ax_triggerKey',ax._triggerKey);
    localStorage.setItem('ax_currentCycle',ax.currentCycle);
    localStorage.setItem('ax_currentCycleName',ax.currentCycleName);
  },

  // Get last state of settings from local storage
  // Returns false if nothing was set.
  // Example
  //   if(! ax.LoadCfg())\{ax.SetCycle('German');\}
  LoadCfg : function(){
    var v;
    if(v = localStorage.getItem('ax_helpLang')){ax._helpLang=v;}     // single = is correct 
    if(v = localStorage.getItem('ax_triggerKey')){ax._triggerKey=v;}  
    if(v = localStorage.getItem('ax_currentCycle')){ax.currentCycle=v;}  
    if(v = localStorage.getItem('ax_currentCycleName')){ax.currentCycleName=v;}  
    return(ax.currentCycle !== '');
  },  

  // Return the current cycle of accents
  GetCycle : function(){
    if(ax._currentCycle ===''){
      ax._UseCycle("EuropeanCombo");
    }
    return ax._currentCycle;
  },  
  
  // Return the current cycle name or false
  // This can be used at initialisation as follows
  GetCycleName : function(){
    var rv = ax._currentCycleName;
    if(!rv){rv = false;}
    return rv;
  },  

  // This is a low-level function for complex editors who only want the next character
  // SetCycle() or a true LoadCfg() must be called once before use
  // Check if ready with GetCycleName()
  // Note: If there is no substitution then this returns false
  NextInCycle : function(CurrentChar){
    if(CurrentChar==' '){return false;}                   // no spaces!
    var ixInCycle = ax.GetCycle().indexOf(CurrentChar);   // look up current
    if(ixInCycle>=0){                                     // found it?
      return ax._currentCycle.substr(ixInCycle+1,1);      // use next
    }else{
      return false;
    }
  },
    
  // Do the dirty deed while editing a textarea or edit box
  // jQuery style of calling is .keyup(ax.Edit);  
  // Inline style of calling is onkeypress="ax.Edit(event);"
  Edit : function(event){
    if(event.key != ax._triggerKey){return;}
    var t = event.target;  
    var ss = t.selectionStart;
    if(ss>0){  // selection point is in play with something to try
      ax._Initialise();
      var text = t.value;
      var charToBeReplaced = text.substring(ss-1,ss);
      // look it up
      var newChar = ax.NextInCycle(charToBeReplaced);
      if(newChar===false){return;}
      //console.log(ixInCycle,charToBeReplaced, '-->' , newChar);
      var newText = text.substring(0,ss-1) + newChar + text.substring(ss);
      t.value = newText;
      t.selectionStart = ss;
      t.selectionEnd = ss;
    }    
  },


  // convenience select box options from array
  ToOptions : function(StringArray){
    return '<option>'+StringArray.join('</option><option>') + '</option>';
  },  

  
  // list the possible languages for help
  GetHelpLanguages : function(){
    var rv = [];
    for(var lang in ax._helpTexts){
      rv.push(lang);
    }  
    rv.sort();
    return rv;
  },  
    
  
  
  // List the available cycles in an array of strings
  // If {WithCycles} is false then just list the names 
  // If {WithCycles} is true then return string in the form <name>|<cycles>
  AvailableCycles : function(WithCycles){
    var cy;
    var rv = [];
    for(var cname in ax._cycles){
      if(WithCycles){
        cy = ax._cycles[cname];
        rv.push(cname + '|' + cy);
      }else{  
        rv.push(cname);
      }  
    }  
    rv.sort();
    return rv;
  },  

  /*
      Fixed data for the Javascript version of AX
      Derived from the Windows version of AX (ax.cfg)
      ****MUST be encoded in UTF-8 ****
      This version 13 Dec 2018
      
      See the Windows AX version for cycle editing instructions
      In short, cycles must start and finish with the same character and have the alternatives inbetween.
      
      Please report improvements you've made to ax@vulpeculox.net
      Download again from vulpeculox.net/ax
    
  */      
      
      
  _triggerKey : "F8",    
      
  _cycles: { 
      "Catalan":"aàa AÀA cçc CÇC eéèe EÉÈE iíi IÍI oóòo OÓÒO uúüu UÚÜU " ,
      "Chinese":"aāáǎàa eēéěèe iīíǐìi oōóǒòo uūúǔùüǖǘǚǜu" ,
      "Czech":"aáa AÁA cčc CČC dďd DĎD eéěe EÉĚE iíi IÍI nňn NŇN oóo OÓO rřr RŘR sšs SŠS tťt TŤT uúůu UÚŮU zžz ZŽZ" ,
      "Danish":"aåæa AÅÆA oøo OØO" ,
      "DutchFrisian":"aáäâàa AÁÄÂÀA cçc CÇC eéëêèe EÉËÊÈE iíïìi IÍÏÌI mµm oóöôòo OÓÖÔÒO sßs SẞS uúüûùµu UÚÜÛÙU yĳýÿy YĲÝŸY" ,
      "Esperanto":"cĉc gĝg hĥh jĵj sŝs uŭu CĈC GĜG HĤH JĴJ SŜS UŬU" ,
      "Estonian":"aäa AÄA oöõo OÖÕO sšs SŠS uüu UÜU zžz ZŽZ" ,
      "Finnish":"aäåa AÄÅA oöo OÖO uüu UÜU" ,
      "FrChin1":"aâäāáǎàa AÀÂÄA cçčc CÇČC eêëēéěèe EÉÊÈËE iîïīíǐìi IÎÏI oôōóǒòo OÔO uüûūúǔùǖǘǚǜu UÛÙÜU" ,
      "French":"aàâäæa AÀÂÄÆA cçc CÇC eéèêëe EÉÊÈËE iîïi IÎÏI oôöœo OÔÖŒO uûùüu UÛÙÜU" ,
      "German":"BßB sßs SẞS aäa AÄA eée EÉE oöo OÖO uüu UÜU" ,
      "Icelandic":"aáåæa AÁÅÆA dðd DÐD iíi IÍI oóöo OÓÖO pþp PÞP tþt TÞT uúµu UÚU yýy YÝY" ,
      "IndicCombo":"aāæǣa AĀA iīi IĪI uūu UŪU eēe oōœॐૐo OŌŒO rṛṝṟr RṚṜṞR lḷḹḻḺl LḶḸḺL tṭt TṬT dḍd DḌD nṇṅñṉn NṆṄÑṈN mṃṁm MṂṀM sṣśs SṢŚS hḥh HḤH" ,
      "Irish":"aáa AÁA bḃb BḂB cċc CĊC dḋd DḊD eée EÉE fḟf FḞF gġg GĠG iíi IÍI mṁm MṀM oóo OÓO pṗp PṖP sṡs SṠS tṫt TṪT uúu UÚU" ,
      "Italian":"aàa AÀA eéèe EÉÈE iíìi IÍÌI oòo OÒO uùu UÙU" ,
      "Magyar":"aáa AÁA eée EÉE oóöőo OÓÖŐO uúüűu UÚÜŰU iíi IÍI" ,
      "Polish":"aąa AĄA cćc CĆC eęe EĘE lłl LŁL nńn NŃN oóo OÓO sśs SŚS zżźz ZŻŹZ" ,
      "Polish1":"aąãa AĄÃA cćčc CĆČC eęëèe EĘËÈE lłl LŁL nńn NŃN oóòôōŏõo OÓÒÔŌŎÕO rřr RŘR sśšs SŚŠS uùůu UÙŮU zżźžz ZŻŹŽZ" ,
      "Portuguese":"aáâàãa AÁÂÀÃA cçc CÇC eéêe EÉÊE iíi IÍI oóôõo OÓÔÕO uúu UÚU" ,
      "Russian":"aаяa AАЯA bбb BБB GГG gгg DДD dдd EЕЁЭE eеёэe FФF fфf IИЙЫI iийыi KКХK kкхk LЛL lлl MМM mмm NНN nнn OОO oоo PПP pпp RРR rрr SСШЩS sсшщs TТЦT tтцt VВV vвv UУЮU uуюu ZЖЗZ zжзz CЧЦC cчцc YЫЬЪY yzыьъy #№#" ,
      "ScandinavianCombo":"aäåæáâa AÄÅÆÁÂA dđd DĐD eéèêe EÉÈÊE gǧǥg GǦǤG hȟh HȞH iïi IÏI kǩk KǨK nŋn NŊN oöøóòôõo OÖØÓÒÔÕO sšs SŠS tŧt TŦT uüu UÜU zžʒǯz ZŽƷǮZ" ,
      "Slovak":"aáäa cčc dďd eée  iíi lľĺl nňn oóôo rřŕr sšs  tťt uúůu yýy zžz AÁÄA CČC DĎD EÉE IÍI LĽĹL NŇN OÓÔO RŘŔR SŠS TŤT UÚŮU YÝY ZŽZ " ,
      "Spanish":"aáa AÁA eée EÉE iíi IÍI oóo OÓO uúüu UÚÜU nñn NÑN ?¿? !¡!" ,
      "Swedish":"aåäa AÅÄA oöo OÖO" ,
      "SwedishSami":"aäåæáâa AÄÅÆÁÂA dđd DĐD gǧǥg GǦǤG hȟh HȞH iïi IÏI kǩk KǨK nŋn NŊN oöøõo OÖØÕO sšs SŠS tŧt TŦT zžʒǯz ZŽƷǮZ" ,
      "Turkish":"aâa AÂA cçc CÇC gğg GĞG iıi IİI oöo OÖO sşs SŞS uüûu UÜÛU" ,
      "WestEuropeanCombo":"aàáâäæãåa AÁÀÂÄÆÃÅA BßB cçc CÇC eéèêëe EÉÊÈËE ií¡îïi IÎÏI oóôöøœõo OÔÖØŒÕO uûúùüu UÛÚÙÜU ?¿? nñn NÑN" ,
      "Math":"2²√2 3³∛3 o°∞o /÷/ =≠±= [∫∑[	*×* ~αβδΩπσθ~" ,
      "Symbol":"£€£ $¢$ c©c .•…. <◀◁«< >▶▷»> #☐☑☒■# *★☆* @●◎◌○@" ,
      "Arrows":"0↷↶↻↺0 1↙⇙1 2↓⇓2 3↘⇘3 4←⇐☚☜4 5↕↔5 6→⇒☛☞6 7↖⇖7 8↑⇑8 9↗⇗9" ,
      "Zodiac":"a♒♈a c♋♑c e♁e f♀f g♊g j♃j l♌♎l m♂☿m n♆n p♇♓p s♄♏♐s t♉t u♅u v♍v" ,
      "Cards":"c♣♧c d♦♢d h♥♡h s♠♤s" ,
      "Chess":"b♗♝b k♘♞♔♚k p♙♟p q♕♛q r♖♜r" ,
      "None":"" },

  _helpTexts : {
    de : {   
      credit : "William Cuthbertson",
      howto : "Drücken Sie *KEY* zu ändern die Buchstabe links vom Cursor. <BR>Vorgang wiederholen, bis das gewünschte Zeichen erscheint."
    },
    en : {
      howto:"Press *KEY* to modify character on left of cursor.<BR>Repeat until the required character appears."
    },
    fr : {
      credit : "Roger KcKeon",
      howto:"Faites *KEY* pour modifier le caractère à gauche du curseur. Répétez l'opération<BR>jusqu'à l'apparition du caractère désiré."
    },
    pl : {
      credit : "George Zolkiewski",
      howto:"Aby zmienić literę na lewo od kursora, wciśnij *KEY* .<BR>Powtórz do ukazania się odpowiedniej litery."
    },
    ma : {
      credit : "Laszlo Horvath",
      howto:"A kurzor bal oldalán lévő karaktert a *KEY* billentyűvel tudod megváltoztatni. <BR> Ismételd amig a kívánt karakter megjelenik."
    }
  }
  
};  

//console.log('ax ok');