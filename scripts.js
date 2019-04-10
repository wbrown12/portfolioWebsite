//---------------------------------
// Define our languages here..
// *NOTE* these will be sorted later, so order here doesn't matter..
const languages = 
[ 
  // Languages I want a hard number of years on..
  {key: "Visual Basic", value: 8},
  {key: "PASCAL",       value: 2},
  {key: "C",            value: 6},
  // Languages I want to lookup the timespan between the value and now..
  {key: "JQuery",       value: new Date(2016,01,01)},
  {key: "Python",       value: new Date(2018,01,01)},
  {key: "Ruby",         value: new Date(2018,01,01)},
  {key: "HTML 5",       value: new Date(2011,01,01)},
  {key: "CSS 3",        value: new Date(2012,01,01)},
  {key: "JavaScript",   value: new Date(2013,01,01)},
  {key: "LUA Script",   value: new Date(2012,01,01)},
  {key: "C++",          value: new Date(1998,01,01)},
  {key: "SQL",          value: new Date(2005,01,01)},
  {key: "ASP.NET",      value: new Date(2007,01,01)},
  {key: "C#",           value: new Date(2009,01,01)},
  {key: "Assembly",     value: new Date(2007,01,01)},
  {key: "XML",          value: new Date(2001,01,01)},
];

//---------------------------------
// Define our Skills here..
// *NOTE* these will be sorted later, so order here doesn't matter..
const skills = 
[ 
  // Skills I want a hard number of years on..
  {key: "Direct X",             value: 2},
  {key: "MS Word",              value: 9},
  {key: "Open GL",              value: 2},
  // Skills I want to lookup the timespan between the value and now..
  {key: "Blockchain",           value: new Date(2018,01,01)},
  {key: "Postman",              value: new Date(2016,01,01)},
  {key: "Linux",                value: new Date(2011,01,01)},
  {key: "Unix",                 value: new Date(2013,01,01)},
  {key: "MySQL",                value: new Date(2015,01,01)},
  {key: "Windows",              value: new Date(1995,01,01)},
  {key: "Visual Studio",        value: new Date(1995,01,01)},
  {key: "MS Excel",             value: new Date(1995,01,01)},
  {key: "Oracle (9i thru 18c)", value: new Date(2005,01,01)},  
  {key: "Windows Server",       value: new Date(2005,01,01)},
  {key: ".NET",                 value: new Date(2001,01,01)},
];

// Given a start DATE, determine return how many years between then and now..
function FillInYears( inDate )
{
  // If we weren't given a date, then return nothing..
  if( inDate == null )
    return 0;

  // Otherwise, compare the given date to NOW..
  var curDate     = Date.now();
  var dateMath    = new Date(curDate - inDate.getTime());
  var yearBetween = Math.abs(dateMath.getFullYear() - 1970);

  // Now return this value..
  return yearBetween;
}

// This will load up the skills and whatnot we have defined in this code..
function LoadUpSkills()
{
   PopulateSkills("Languages",  languages);
   PopulateSkills("Skills",     skills);
}

function PopulateSkills( home, ourMap )
{
  // First sort the list in order by DATE (which is the value)..
  ourMap.sort(function (left, right)
  {
    var leftYears  = (left.value  != null && typeof left.value  == "number") ?  left.value  : FillInYears(left.value);
    var rightYears = (right.value != null && typeof right.value == "number") ?  right.value : FillInYears(right.value);
    return rightYears - leftYears;
  });

  // Make a copy of the sorted array..
  var sortedArr = [...ourMap].sort();

  // Now iterate thru the sorted map, and put the content where it belongs..
  for( var i=0; i<=sortedArr.length; i++ )
  {
    // Ignore empty entries..
    if( sortedArr[i] == null )
      continue;

    // How many years for this item??
    var skillKey = sortedArr[i].key;
    var numYears = ((typeof sortedArr[i].value == "number") ?  sortedArr[i].value : FillInYears(sortedArr[i].value));

    // Determine WHICH bucket this fits into..
    // Beginner     between 0 and 3
    // Intermediate between 4 and 9
    // Advanced     10 and over..
    var whichBucket;
    if(      numYears > 10 ) whichBucket = document.getElementById("advanced"     + home);
    else if( numYears > 4  ) whichBucket = document.getElementById("intermediate" + home);
    else                     whichBucket = document.getElementById("beginner"     + home);
    //console.log(numYears + " = " + whichBucket.id);

    // Render them line by line (more mobile friendly):
    // <p>key - N Years..</p>
    var pEle = document.createElement("p");
    pEle.textContent = skillKey + " - " + numYears + " years..";
    whichBucket.appendChild( pEle );
  }
}


