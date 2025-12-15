
export const CASTE_DATA: Record<string, string[]> = {
  "Khandelwal": [
    "Aakad", "Agri", "Aranya", "Attal", "Badaya", "Bajargan", "Baldua", "Bali", "Bandal", "Banka", 
    "Bhadaliya", "Bhatwara", "Bhukhmaria", "Bichpuriya", "Boongiya", "Budarwal", "Budhwariya", 
    "Chandanwal", "Chaudhari", "Chitlangi", "Dangayach", "Devan", "Dhoka", "Dhokariya", "Dhusi", 
    "Gheeya", "Goliya", "Hada", "Haldia", "Jadawat", "Jhalani", "Jhanjhari", "Jokhari", "Jotwani", 
    "Jwalya", "Kalani", "Kanjoliya", "Kasat", "Kasliwal", "Kath", "Khandar", "Khatod", "Khatta", 
    "Khunteta", "Kohli", "Koolwal", "Luhadiya", "Luhariwal", "Mithawalia", "Moosya", "Natani", 
    "Pandala", "Pitaliya", "Pithaliya", "Puri", "Rawat", "Roongta", "Samoliya", "Sankhla", "Saraf", 
    "Singhal", "Sogi", "Soonwal", "Tamra", "Telani", "Tholiya", "Tholya", "Todi", "Vyas", "Zanwar", 
    "Bhojya", "Chunwal", "Pohalya", "Varniwal"
  ],
  "Agarwal": [
    "Garg", "Goyal", "Kansal", "Bansal", "Singhal", "Mittal", "Jindal", "Mangal", "Tingal", 
    "Airan", "Dharan", "Madhukul", "Tayal", "Bhandal", "Kuchchal", "Nagal", "Bindal", "Goyan"
  ],
  "Jain": [
    "Oswal", "Porwal", "Shrimal", "Humad", "Bagherwal", "Khandelwal", "Sancheti", "Bafna"
  ],
  "Maheswari": [
    "Agiwal", "Asava", "Attal", "Baldua", "Baheti", "Bajaj", "Bhandari", "Bhattad", "Bhansaali", 
    "Birla", "Chandak", "Daga", "Dhoot", "Gagrani", "Heda", "Jajoo", "Jhanwar", "Kabra"
  ],
  "Gupta": [
    "Kashyap", "Vatsa", "Garg", "Bharadwaj", "Kaushik", "Maitrey", "Parashar", "Dharana"
  ],
  "Oswal": [
    "Bafna", "Chhajed", "Chopda", "Dugar", "Golechha", "Kabra", "Lodha", "Mundra", "Sancheti", "Surana"
  ]
};

export const CASTES = Object.keys(CASTE_DATA);
export const GOTRA_MAP = CASTE_DATA;

export const SALARY_SLABS = [
  '0-3 LPA', '3-5 LPA', '5-7 LPA', '7-10 LPA', '10-15 LPA', 
  '15-20 LPA', '20-25 LPA', '25-30 LPA', '30+ LPA'
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

export const TITLES = ['Mr', 'Miss', 'Mrs', 'Late', 'Dr', 'Er'];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const DIETS = ['Vegetarian', 'Jain', 'Non-Vegetarian', 'Vegan'];
export const SKINS = ['Fair', 'Wheatish', 'Dusky', 'Dark'];

export const EDUCATION_LEVELS = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Professional', 'Doctorate', 'Other'];
export const EDUCATION_STREAMS = ['Engineering', 'Medical', 'Arts', 'Commerce', 'Science', 'Law', 'Management', 'Design', 'Other'];

export const STEPS = [
  'Basic Info', 'Social & Religious', 'Location', 'Education & Career', 
  'Family Details', 'Health', 'Partner Preferences', 'Photos & Bio'
];
