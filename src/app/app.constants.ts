export class AppConstants {
  constructor() {}

  public static userRole = {
    driver: 'Driver',
    admin: 'Admin',
    user: 'User',
    vendor: 'Vendor',
    deliveryBoy: 'DeliveryBoy'
  };

  public static prefferedLanguages = {
    en: 'en',
    de: 'de'
  };

  public static nameOrId = {
    GetId: 'getId',
    GetName: 'getName'
  }
  public static DELAYTOOLTIP = {
    duration: 7200
  }

  public static SNACK_BAR_DELAY = {
    duration: 7200
  };

  public static SNACK_BAR_UNDEFINED= {
    duration: undefined
  };

  public static Europe_Countries = [{
    name: 'Russia',
    code: 'RU'
  }, {
    name: 'Germany',
    code: 'DE'
  }, {
    name: 'United Kingdom',
    code: 'UK'
  }, {
    name: 'France',
    code: 'FR'
  }, {
    name: 'Italy',
    code: 'IT'
  }, {
    name: 'Spain',
    code: 'ES'
  }, {
    name: 'Ukraine',
    code: 'UA'
  }, {
    name: 'Poland',
    code: 'PL'
  }, {
    name: 'Romania',
    code: 'RO'
  }, {
    name: 'Netherlands',
    code: 'NL'
  }, {
    name: 'Belgium',
    code: 'BE'
  }, {
    name: 'Czechia',
    code: 'CZ'
  }, {
    name: 'Greece',
    code: 'EL'
  }, {
    name: 'Portugal',
    code: 'PT'
  }, {
    name: 'Sweden',
    code: 'SE'
  }, {
    name: 'Hungary',
    code: 'HU'
  }, {
    name: 'Belarus',
    code: 'BY'
  }, {
    name: 'Austria',
    code: 'AT'
  }, {
    name: 'Serbia',
    code: 'RS'
  }, {
    name: 'Switzerland',
    code: 'CH'
  }, {
    name: 'Bulgaria',
    code: 'BG'
  }, {
    name: 'Denmark',
    code: 'DK'
  }, {
    name: 'Finland',
    code: 'FI'
  }, {
    name: 'Slovakia',
    code: 'SK'
  }, {
    name: 'Norway',
    code: 'NO'
  }, {
    name: 'Ireland',
    code: 'IE'
  }, {
    name: 'Croatia',
    code: 'HR'
  }, {
    name: 'Moldova',
    code: 'MD'
  }, {
    name: 'Bosnia and Herzegovina',
    code: 'BA'
  }, {
    name: 'Albania',
    code: 'AL'
  }, {
    name: 'Lithuania',
    code: 'LT'
  }, {
    name: 'North Macedonia',
    code: 'MK'
  }, {
    name: 'Slovenia',
    code: 'SI'
  }, {
    name: 'Latvia',
    code: 'LV'
  }, {
    name: 'Estonia',
    code: 'EE'
  }, {
    name: 'Montenegro',
    code: 'ME'
  }, {
    name: 'Luxembourg',
    code: 'LU'
  }, {
    name: 'Malta',
    code: 'MT'
  }, {
    name: 'Iceland',
    code: 'IS'
  }, {
    name: 'Andorra',
    code: 'AD'
  }, {
    name: 'Monaco',
    code: 'MC'
  }, {
    name: 'Liechtenstein',
    code: 'LI'
  }, {
    name: 'San Marino',
    code: 'SM'
  }, {
    name: 'Holy See',
    code: 'HS'
  }];

  public static RegeExpressionAlphabets = '^[a-zA-ZäüößáéíóúÄÜÖÁÉÍÓÚ´]*$';

  public static StorageValues= ['apiToken', 'userInfo', 'loggedIn'];

  public static userType = {
    admin: 'Admin',
    user: 'User',
    vendor: 'Vendor',
    deliveryBoy: 'DeliveryBoy'
  }

  public static permissionType = {
    admin: '1',
    user: '2',
    vendor: '3',
    deliveryBoy: '4'
  }

  public static  image = {
    uploadDefault: 'assets/imgs/theme/upload.svg'
  }

  
}