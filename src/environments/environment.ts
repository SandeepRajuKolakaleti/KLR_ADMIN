// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    URL: 'http://localhost:9090/'// 'http://klrapigateloadbalancer-1724370165.us-east-1.elb.amazonaws.com/'
  },
  google: {
    id: '600135194254-c8a82q0ngtpk2nsqbfd1difb5an9te3b.apps.googleusercontent.com' // aws access id - 600135194254-lmetug59vn8r2giqag31jhn4nf985enc.apps.googleusercontent.com
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
