export enum Country {
  Afghanistan = 'afghanistan',
  Albania = 'albania',
  Algeria = 'algeria',
  Andorra = 'andorra',
  Angola = 'angola',
  AntiguaAndBarbuda = 'antigua-and-barbuda',
  Argentina = 'argentina',
  Armenia = 'armenia',
  Australia = 'australia',
  Austria = 'austria',
  Azerbaijan = 'azerbaijan',
  Bahamas = 'bahamas',
  Bahrain = 'bahrain',
  Bangladesh = 'bangladesh',
  Barbados = 'barbados',
  Belarus = 'belarus',
  Belgium = 'belgium',
  Belize = 'belize',
  Benin = 'benin',
  Bhutan = 'bhutan',
  Bolivia = 'bolivia',
  BosniaAndHerzegovina = 'bosnia-and-herzegovina',
  Botswana = 'botswana',
  Brazil = 'brazil',
  Brunei = 'brunei',
  Bulgaria = 'bulgaria',
  BurkinaFaso = 'burkina-faso',
  Burundi = 'burundi',
  CaboVerde = 'cabo-verde',
  Cambodia = 'cambodia',
  Cameroon = 'cameroon',
  Canada = 'canada',
  CentralAfricanRepublic = 'central-african-republic',
  Chad = 'chad',
  Chile = 'chile',
  China = 'china',
  Colombia = 'colombia',
  Comoros = 'comoros',
  Congo = 'congo',
  CostaRica = 'costa-rica',
  CoteDIvoire = 'cote-divoire',
  Croatia = 'croatia',
  Cuba = 'cuba',
  Cyprus = 'cyprus',
  CzechRepublic = 'czech-republic',
  Denmark = 'denmark',
  Djibouti = 'djibouti',
  Dominica = 'dominica',
  DominicanRepublic = 'dominican-republic',
  EastTimor = 'east-timor',
  Ecuador = 'ecuador',
  Egypt = 'egypt',
  ElSalvador = 'el-salvador',
  EquatorialGuinea = 'equatorial-guinea',
  Eritrea = 'eritrea',
  Estonia = 'estonia',
  Eswatini = 'eswatini',
  Ethiopia = 'ethiopia',
  Fiji = 'fiji',
  Finland = 'finland',
  France = 'france',
  Gabon = 'gabon',
  Gambia = 'gambia',
  Georgia = 'georgia',
  Germany = 'germany',
  Ghana = 'ghana',
  Greece = 'greece',
  Grenada = 'grenada',
  Guatemala = 'guatemala',
  Guinea = 'guinea',
  GuineaBissau = 'guinea-bissau',
  Guyana = 'guyana',
  Haiti = 'haiti',
  Honduras = 'honduras',
  Hungary = 'hungary',
  Iceland = 'iceland',
  India = 'india',
  Indonesia = 'indonesia',
  Iran = 'iran',
  Iraq = 'iraq',
  Ireland = 'ireland',
  Israel = 'israel',
  Italy = 'italy',
  Jamaica = 'jamaica',
  Japan = 'japan',
  Jordan = 'jordan',
  Kazakhstan = 'kazakhstan',
  Kenya = 'kenya',
  Kiribati = 'kiribati',
  KoreaNorth = 'korea-north',
  KoreaSouth = 'korea-south',
  Kosovo = 'kosovo',
  Kuwait = 'kuwait',
  Kyrgyzstan = 'kyrgyzstan',
  Laos = 'laos',
  Latvia = 'latvia',
  Lebanon = 'lebanon',
  Lesotho = 'lesotho',
  Liberia = 'liberia',
  Libya = 'libya',
  Liechtenstein = 'liechtenstein',
  Lithuania = 'lithuania',
  Luxembourg = 'luxembourg',
  Madagascar = 'madagascar',
  Malawi = 'malawi',
  Malaysia = 'malaysia',
  Maldives = 'maldives',
  Mali = 'mali',
  Malta = 'malta',
  MarshallIslands = 'marshall-islands',
  Mauritania = 'mauritania',
  Mauritius = 'mauritius',
  Mexico = 'mexico',
  Micronesia = 'micronesia',
  Moldova = 'moldova',
  Monaco = 'monaco',
  Mongolia = 'mongolia',
  Montenegro = 'montenegro',
  Morocco = 'morocco',
  Mozambique = 'mozambique',
  Myanmar = 'myanmar',
  Namibia = 'namibia',
  Nauru = 'nauru',
  Nepal = 'nepal',
  Netherlands = 'netherlands',
  NewZealand = 'new-zealand',
  Nicaragua = 'nicaragua',
  Niger = 'niger',
  Nigeria = 'nigeria',
  NorthMacedonia = 'north-macedonia',
  Norway = 'norway',
  Oman = 'oman',
  Pakistan = 'pakistan',
  Palau = 'palau',
  Panama = 'panama',
  PapuaNewGuinea = 'papua-new-guinea',
  Paraguay = 'paraguay',
  Peru = 'peru',
  Philippines = 'philippines',
  Poland = 'poland',
  Portugal = 'portugal',
  Qatar = 'qatar',
  Romania = 'romania',
  Russia = 'russia',
  Rwanda = 'rwanda',
  SaintKittsAndNevis = 'saint-kitts-and-nevis',
  SaintLucia = 'saint-lucia',
  SaintVincentAndTheGrenadines = 'saint-vincent-and-the-grenadines',
  Samoa = 'samoa',
  SanMarino = 'san-marino',
  SaoTomeAndPrincipe = 'sao-tome-and-principe',
  SaudiArabia = 'saudi-arabia',
  Senegal = 'senegal',
  Serbia = 'serbia',
  Seychelles = 'seychelles',
  SierraLeone = 'sierra-leone',
  Singapore = 'singapore',
  Slovakia = 'slovakia',
  Slovenia = 'slovenia',
  SolomonIslands = 'solomon-islands',
  Somalia = 'somalia',
  SouthAfrica = 'south-africa',
  SouthSudan = 'south-sudan',
  Spain = 'spain',
  SriLanka = 'sri-lanka',
  Sudan = 'sudan',
  Suriname = 'suriname',
  Sweden = 'sweden',
  Switzerland = 'switzerland',
  Syria = 'syria',
  Taiwan = 'taiwan',
  Tajikistan = 'tajikistan',
  Tanzania = 'tanzania',
  Thailand = 'thailand',
  Togo = 'togo',
  Tonga = 'tonga',
  TrinidadAndTobago = 'trinidad-and-tobago',
  Tunisia = 'tunisia',
  Turkey = 'turkey',
  Turkmenistan = 'turkmenistan',
  Tuvalu = 'tuvalu',
  Uganda = 'uganda',
  Ukraine = 'ukraine',
  UnitedArabEmirates = 'united-arab-emirates',
  UnitedKingdom = 'united-kingdom',
  UnitedStates = 'united-states',
  Uruguay = 'uruguay',
  Uzbekistan = 'uzbekistan',
  Vanuatu = 'vanuatu',
  Venezuela = 'venezuela',
  Vietnam = 'vietnam',
  Yemen = 'yemen',
  Zambia = 'zambia',
  Zimbabwe = 'zimbabwe'
}

export interface CountryData {
  name: Country;
  descriptionTranslationKey: string;
  tippingRange?: { 
    min: number;
    max: number;
  };
  code: string;
}
