var te = te || {};
te.settings = [
   { name: "Name", edit: "read_only", width: 80 },
   { name: "HireDate", edit: "edit", width: 100, type: "date" },
   { name: "Phone", edit: "read_only", width: 120, type:"phone" },
   { name: "Salary", edit: "edit", width: 96, type:"float" },
   { name: "MaritalStatus", edit: "edit", width: 106, type:"autocompl",
   options: { 1: 'Divorced', 2: 'Married', 3: 'Single', 4:'Commom-Law'} },
   { name: "EmployeeType", edit: "edit", width: 100, type:"custselect",
       options: { 1:'Hourly',2:'Temp', 3:'Salary', 4:'W2', 5:'Contract-to-hire', 6:'Corp to corp'}},
   { name: "StartTime", edit: "edit", width: 90, type:"custselect" }
];
te.data = [
    {
        "Name": "Herman Wilcox",
        "HireDate": "Feb 12, 2016",
        "Phone": "1-555-555-5555",
        "Salary": 52485,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Olympia Richard",
        "HireDate": "May 20, 2011",
        "Phone": "1-555-555-5555",
        "Salary": 42359,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Barry Gilliam",
        "HireDate": "May 22, 2001",
        "Phone": "1-555-555-5555",
        "Salary": 65205,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Oprah Walls",
        "HireDate": "Jun 20, 2009",
        "Phone": "1-555-555-5555",
        "Salary": 97655,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Dustin Elliott",
        "HireDate": "Jul 31, 2012",
        "Phone": "1-555-555-5555",
        "Salary": 52204,
        "MaritalStatus": "Married",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Dakota Murphy",
        "HireDate": "Apr 28, 2002",
        "Phone": "1-555-555-5555",
        "Salary": 111314,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Benjamin Lott",
        "HireDate": "Jun 11, 1995",
        "Phone": "1-555-555-5555",
        "Salary": 45318,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Felicia Berry",
        "HireDate": "May 19, 1993",
        "Phone": "1-555-555-5555",
        "Salary": 116163,
        "MaritalStatus": "Married",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Stewart Copeland",
        "HireDate": "Dec 1, 1996",
        "Phone": "1-555-555-5555",
        "Salary": 76454,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Amy Fletcher",
        "HireDate": "Apr 30, 2011",
        "Phone": "1-555-555-5555",
        "Salary": 77345,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Olga Mendez",
        "HireDate": "Feb 28, 2010",
        "Phone": "1-555-555-5555",
        "Salary": 97887,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Caesar Blevins",
        "HireDate": "Nov 3, 1994",
        "Phone": "1-555-555-5555",
        "Salary": 50962,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Yael Cervantes",
        "HireDate": "Jul 1, 1993",
        "Phone": "1-555-555-5555",
        "Salary": 58193,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Odysseus Vaughn",
        "HireDate": "Sep 5, 2012",
        "Phone": "1-555-555-5555",
        "Salary": 110972,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Karyn Cobb",
        "HireDate": "Feb 23, 2009",
        "Phone": "1-555-555-5555",
        "Salary": 40992,
        "MaritalStatus": "Married",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Veronica Daugherty",
        "HireDate": "Jun 5, 2000",
        "Phone": "1-555-555-5555",
        "Salary": 77944,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Wynter Mcintyre",
        "HireDate": "Aug 18, 2012",
        "Phone": "1-555-555-5555",
        "Salary": 38933,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Susan Barrett",
        "HireDate": "Aug 15, 1990",
        "Phone": "1-555-555-5555",
        "Salary": 40549,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Yuli Mayo",
        "HireDate": "Feb 28, 2014",
        "Phone": "1-555-555-5555",
        "Salary": 56091,
        "MaritalStatus": "Married",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Destiny Villarreal",
        "HireDate": "Aug 22, 1991",
        "Phone": "1-555-555-5555",
        "Salary": 66536,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Harper Hodge",
        "HireDate": "Aug 23, 2011",
        "Phone": "1-555-555-5555",
        "Salary": 100350,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Elijah Osborne",
        "HireDate": "Jul 16, 2011",
        "Phone": "1-555-555-5555",
        "Salary": 72560,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Kimberly Curry",
        "HireDate": "May 2, 2014",
        "Phone": "1-555-555-5555",
        "Salary": 78281,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Brittany Ratliff",
        "HireDate": "Dec 18, 2003",
        "Phone": "1-555-555-5555",
        "Salary": 64223,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Melinda Farrell",
        "HireDate": "Mar 24, 2001",
        "Phone": "1-555-555-5555",
        "Salary": 66793,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Marvin Boyle",
        "HireDate": "Oct 5, 1994",
        "Phone": "1-555-555-5555",
        "Salary": 37989,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Bo Jensen",
        "HireDate": "Feb 15, 2006",
        "Phone": "1-555-555-5555",
        "Salary": 98932,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Tyrone Massey",
        "HireDate": "Jan 7, 1996",
        "Phone": "1-555-555-5555",
        "Salary": 60230,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Kiara Bender",
        "HireDate": "Jul 27, 1999",
        "Phone": "1-555-555-5555",
        "Salary": 59258,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Suki Meyer",
        "HireDate": "Oct 30, 2000",
        "Phone": "1-555-555-5555",
        "Salary": 94169,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Shelly Schultz",
        "HireDate": "Oct 4, 2009",
        "Phone": "1-555-555-5555",
        "Salary": 70797,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Ezekiel Levy",
        "HireDate": "Jun 12, 1996",
        "Phone": "1-555-555-5555",
        "Salary": 56883,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Chastity Parker",
        "HireDate": "Feb 10, 2003",
        "Phone": "1-555-555-5555",
        "Salary": 84820,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Olga Mcclain",
        "HireDate": "Mar 17, 1999",
        "Phone": "1-555-555-5555",
        "Salary": 69697,
        "MaritalStatus": "Married",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Yetta Ford",
        "HireDate": "Sep 16, 2011",
        "Phone": "1-555-555-5555",
        "Salary": 85211,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Samson Haynes",
        "HireDate": "Jan 2, 1999",
        "Phone": "1-555-555-5555",
        "Salary": 66871,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Keelie Whitehead",
        "HireDate": "Jul 25, 2015",
        "Phone": "1-555-555-5555",
        "Salary": 38215,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Bruno Gallagher",
        "HireDate": "Oct 30, 1994",
        "Phone": "1-555-555-5555",
        "Salary": 35682,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Russell Terry",
        "HireDate": "Apr 5, 2016",
        "Phone": "1-555-555-5555",
        "Salary": 55758,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Cameron Mayer",
        "HireDate": "Jun 17, 2000",
        "Phone": "1-555-555-5555",
        "Salary": 84941,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Rhona Torres",
        "HireDate": "Jan 10, 1996",
        "Phone": "1-555-555-5555",
        "Salary": 84568,
        "MaritalStatus": "Married",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Aidan Warren",
        "HireDate": "Sep 27, 2010",
        "Phone": "1-555-555-5555",
        "Salary": 58473,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Owen Bridges",
        "HireDate": "Jun 9, 2001",
        "Phone": "1-555-555-5555",
        "Salary": 113744,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Raphael Clark",
        "HireDate": "Jul 16, 1990",
        "Phone": "1-555-555-5555",
        "Salary": 98707,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Ariana Carver",
        "HireDate": "Feb 26, 2009",
        "Phone": "1-555-555-5555",
        "Salary": 102838,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Rhea Hanson",
        "HireDate": "Oct 8, 1992",
        "Phone": "1-555-555-5555",
        "Salary": 110276,
        "MaritalStatus": "Married",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Celeste Knight",
        "HireDate": "Apr 9, 2004",
        "Phone": "1-555-555-5555",
        "Salary": 89348,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Genevieve Black",
        "HireDate": "Apr 30, 2012",
        "Phone": "1-555-555-5555",
        "Salary": 116512,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Kelsie Bradley",
        "HireDate": "Jan 27, 1997",
        "Phone": "1-555-555-5555",
        "Salary": 87161,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Ross Donovan",
        "HireDate": "Jul 26, 1999",
        "Phone": "1-555-555-5555",
        "Salary": 78099,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Kelly Small",
        "HireDate": "Mar 3, 1992",
        "Phone": "1-555-555-5555",
        "Salary": 55169,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Martina Richards",
        "HireDate": "Aug 19, 1995",
        "Phone": "1-555-555-5555",
        "Salary": 107253,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Maile Dorsey",
        "HireDate": "Mar 29, 1995",
        "Phone": "1-555-555-5555",
        "Salary": 111804,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Bertha Wolf",
        "HireDate": "May 28, 1996",
        "Phone": "1-555-555-5555",
        "Salary": 54327,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Tatyana Lambert",
        "HireDate": "Aug 7, 2015",
        "Phone": "1-555-555-5555",
        "Salary": 95352,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Patricia Rutledge",
        "HireDate": "Sep 19, 1995",
        "Phone": "1-555-555-5555",
        "Salary": 109233,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Lavinia Bryant",
        "HireDate": "Jan 18, 1991",
        "Phone": "1-555-555-5555",
        "Salary": 64749,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Wyatt Mccarthy",
        "HireDate": "Sep 8, 1993",
        "Phone": "1-555-555-5555",
        "Salary": 39970,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Kristen Orr",
        "HireDate": "Sep 24, 2000",
        "Phone": "1-555-555-5555",
        "Salary": 44959,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Ayanna Pace",
        "HireDate": "Apr 13, 1996",
        "Phone": "1-555-555-5555",
        "Salary": 59441,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Hoyt Page",
        "HireDate": "Jun 3, 2014",
        "Phone": "1-555-555-5555",
        "Salary": 35655,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Maxine Gibson",
        "HireDate": "Apr 25, 2003",
        "Phone": "1-555-555-5555",
        "Salary": 71954,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Mufutau Lewis",
        "HireDate": "Apr 9, 1990",
        "Phone": "1-555-555-5555",
        "Salary": 94363,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Leigh Heath",
        "HireDate": "Sep 3, 2001",
        "Phone": "1-555-555-5555",
        "Salary": 69238,
        "MaritalStatus": "Married",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Colin Maddox",
        "HireDate": "Jun 8, 2003",
        "Phone": "1-555-555-5555",
        "Salary": 34290,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Beverly Perez",
        "HireDate": "Mar 19, 2006",
        "Phone": "1-555-555-5555",
        "Salary": 86964,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Len Noel",
        "HireDate": "May 15, 2010",
        "Phone": "1-555-555-5555",
        "Salary": 85978,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Maggy Mcfadden",
        "HireDate": "Sep 15, 1992",
        "Phone": "1-555-555-5555",
        "Salary": 60809,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Keelie Levy",
        "HireDate": "Jan 31, 2004",
        "Phone": "1-555-555-5555",
        "Salary": 102400,
        "MaritalStatus": "Married",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Alden Dennis",
        "HireDate": "Jul 8, 2004",
        "Phone": "1-555-555-5555",
        "Salary": 76123,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Jada Herring",
        "HireDate": "Mar 25, 2004",
        "Phone": "1-555-555-5555",
        "Salary": 109476,
        "MaritalStatus": "Married",
        "EmployeeType": "Salary",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Malik Spencer",
        "HireDate": "Mar 25, 2011",
        "Phone": "1-555-555-5555",
        "Salary": 80623,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Melvin Park",
        "HireDate": "Mar 12, 2011",
        "Phone": "1-555-555-5555",
        "Salary": 59046,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Xenos Cross",
        "HireDate": "Feb 26, 2010",
        "Phone": "1-555-555-5555",
        "Salary": 102469,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Britanney Mayo",
        "HireDate": "Jan 15, 2012",
        "Phone": "1-555-555-5555",
        "Salary": 48352,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Raya Mccormick",
        "HireDate": "Jan 11, 1998",
        "Phone": "1-555-555-5555",
        "Salary": 35548,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Brenna Lara",
        "HireDate": "Dec 15, 2007",
        "Phone": "1-555-555-5555",
        "Salary": 30428,
        "MaritalStatus": "Married",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Rhea Cantrell",
        "HireDate": "Oct 16, 2003",
        "Phone": "1-555-555-5555",
        "Salary": 96234,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Doris Christensen",
        "HireDate": "Aug 2, 2015",
        "Phone": "1-555-555-5555",
        "Salary": 89129,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Harding Howell",
        "HireDate": "Jun 27, 2007",
        "Phone": "1-555-555-5555",
        "Salary": 103770,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Tarik Frost",
        "HireDate": "Jul 3, 1994",
        "Phone": "1-555-555-5555",
        "Salary": 100628,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Alice Benjamin",
        "HireDate": "Apr 20, 1992",
        "Phone": "1-555-555-5555",
        "Salary": 65498,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Wayne Carr",
        "HireDate": "May 12, 2001",
        "Phone": "1-555-555-5555",
        "Salary": 67462,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Jasmine Perry",
        "HireDate": "Aug 18, 1991",
        "Phone": "1-555-555-5555",
        "Salary": 61620,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Rylee Romero",
        "HireDate": "Mar 2, 2009",
        "Phone": "1-555-555-5555",
        "Salary": 104204,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Kasimir Mckay",
        "HireDate": "Aug 17, 1991",
        "Phone": "1-555-555-5555",
        "Salary": 115739,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Buckminster Solis",
        "HireDate": "Nov 30, 1997",
        "Phone": "1-555-555-5555",
        "Salary": 51968,
        "MaritalStatus": "Married",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Tanya Church",
        "HireDate": "Mar 28, 1997",
        "Phone": "1-555-555-5555",
        "Salary": 95572,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Damian Barnes",
        "HireDate": "Apr 18, 2003",
        "Phone": "1-555-555-5555",
        "Salary": 52601,
        "MaritalStatus": "Single",
        "EmployeeType": "Temp",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Lenore Roach",
        "HireDate": "Dec 17, 2006",
        "Phone": "1-555-555-5555",
        "Salary": 74658,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Craig Buckley",
        "HireDate": "May 2, 2000",
        "Phone": "1-555-555-5555",
        "Salary": 90369,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Veda Cameron",
        "HireDate": "Feb 16, 2012",
        "Phone": "1-555-555-5555",
        "Salary": 32750,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Nayda Hobbs",
        "HireDate": "Jun 21, 1994",
        "Phone": "1-555-555-5555",
        "Salary": 54707,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Richard Calhoun",
        "HireDate": "Sep 1, 2001",
        "Phone": "1-555-555-5555",
        "Salary": 68473,
        "MaritalStatus": "Single",
        "EmployeeType": "Hourly",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Ivan Rice",
        "HireDate": "Mar 8, 1992",
        "Phone": "1-555-555-5555",
        "Salary": 85754,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Ira Davenport",
        "HireDate": "Aug 15, 2000",
        "Phone": "1-555-555-5555",
        "Salary": 43660,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Stewart Jones",
        "HireDate": "Dec 27, 1993",
        "Phone": "1-555-555-5555",
        "Salary": 114277,
        "MaritalStatus": "Divorced",
        "EmployeeType": "Temp",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Dustin Luna",
        "HireDate": "Dec 23, 2000",
        "Phone": "1-555-555-5555",
        "Salary": 92714,
        "MaritalStatus": "Common-Law",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    },
    {
        "Name": "Hu Dotson",
        "HireDate": "Mar 17, 1992",
        "Phone": "1-555-555-5555",
        "Salary": 104070,
        "MaritalStatus": "Single",
        "EmployeeType": "Salary",
        "StartTime": "12:00 PM"
    },
    {
        "Name": "Denise Drake",
        "HireDate": "May 24, 2001",
        "Phone": "1-555-555-5555",
        "Salary": 86856,
        "MaritalStatus": "Married",
        "EmployeeType": "Hourly",
        "StartTime": "01:00 PM"
    }
]
