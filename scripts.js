//---------------------------------
// Define our languages here..
const beginnerLanguages = 
[ 
  {key: "JQuery", value: new Date(2016,01,01)},
  {key: "Python", value: new Date(2018,01,01)},
  {key: "Ruby",   value: new Date(2018,01,01)},
];
const intermediateLanguages = 
[ 
  {key: "HTML 5",     value: new Date(2011,01,01)},
  {key: "CSS 3",      value: new Date(2012,01,01)},
  {key: "JavaScript", value: new Date(2013,01,01)},
  {key: "LUA Script", value: new Date(2012,01,01)},
];
const advancedLanguages = 
[ 
  {key: "C++",          value: new Date(1998,01,01)},
  {key: "Visual Basic", value: 8},
  {key: "SQL",          value: new Date(2005,01,01)},
  {key: "ASP.NET",      value: new Date(2007,01,01)},
  {key: "C#",           value: new Date(2009,01,01)},
];

//---------------------------------
// Define our Skills here..
const beginnerSkills = 
[ 
  {key: "Blockchain", value: new Date(2018,01,01)},
  {key: "Postman",    value: new Date(2016,01,01)},
];
const intermediateSkills = 
[ 
  {key: "Linux",    value: new Date(2011,01,01)},
  {key: "Unix",     value: new Date(2013,01,01)},
  {key: "MySQL",    value: new Date(2015,01,01)},
];
const advancedSkills = 
[ 
  {key: "Windows",              value: new Date(1995,01,01)},
  {key: "Visual Studio",        value: new Date(1995,01,01)},
  {key: "MS Excel",             value: new Date(1995,01,01)},
  {key: "MS Word",              value: new Date(1995,01,01)},
  {key: "Oracle (9i thru 18c)", value: new Date(2005,01,01)},  
  {key: "Windows Server",       value: new Date(2005,01,01)},
];


// Given a start DATE, determine return how many years between then and now..
function FillInYears( inDate )
{
  console.log(inDate);

  // If we weren't given a date, then return nothing..
  if( inDate === null )
    return 0;

  // Otherwise, compare the given date to NOW..
  var curDate  = Date.now();
  var dateMath = new Date(curDate - inDate.getTime());
  var yearBetween = Math.abs(dateMath.getFullYear() - 1970);

  // Build up the text we want to render here..
  var ourText = yearBetween + " years..";
  //console.log(ourText);

  // Now return this value..
  return ourText;
}

// This will load up the skills and whatnot we have defined in this code..
function LoadUpSkills()
{
   // Iterate thru our maps, and generate the language elements..
   PopulateSkills(document.getElementById("beginnerLanguages"),     beginnerLanguages);
   PopulateSkills(document.getElementById("intermediateLanguages"), intermediateLanguages);
   PopulateSkills(document.getElementById("advancedLanguages"),     advancedLanguages);

   // Now do the same for the skills..
   PopulateSkills(document.getElementById("beginnerSkills"),     beginnerSkills);
   PopulateSkills(document.getElementById("intermediateSkills"), intermediateSkills);
   PopulateSkills(document.getElementById("advancedSkills"),     advancedSkills);
}

function PopulateSkills( home, ourMap )
{
   for( var i=0; i<=ourMap.length; i++ )
   {
      // Ignore empty entries..
      if( ourMap[i] == null )
        continue;

      // Assuming we are valid, inject TEXT in this format:
      // <div>
      //   Key
      //   <p>N Years of experience..</p>
      // </div>
      //home.appendChild( document.createTextNode(ourMap[i].key) );
      //var pEle = document.createElement("p");
      //pEle.textContent = FillInYears(ourMap[i].value);
      //home.appendChild( pEle );

      // OR..
      // We could render them line by line (more mobile friendly):
      var pEle = document.createElement("p");
      pEle.textContent = ourMap[i].key + " - " + ((typeof ourMap[i].value == "number") ?  ourMap[i].value + " years.." : FillInYears(ourMap[i].value)) ;
      home.appendChild( pEle );
   }
}


