import { Geolocation } from '@capacitor/geolocation';

export class LocationHelper {

  async getCurrentLocation()  {
    try {
      // Request location permission
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location === 'denied') {
        await Geolocation.requestPermissions();
      }

      // Get current position
      const position = await Geolocation.getCurrentPosition();
      
      // Get country from coordinates using reverse geocoding
      const { latitude, longitude } = position.coords;
      const { success, data } = await this._reverseGeocode(latitude, longitude);

      return {success, data};
      
    } catch (error) {
      console.error('Error:', error);
      return {success: false, data: null};
    }
  };

  private async _reverseGeocode(latitude: number, longitude: number) {
    try {
      const response =  await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0', // Replace with your app name
          },
        }
      );

      return {success: true, data: await response.json()};
    } catch (error) {
      console.error('Geocoding error:', error);
      return {success: false, data: null};
    }
  };
}
