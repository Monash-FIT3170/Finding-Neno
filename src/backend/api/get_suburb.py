# import requests

# def get_suburb(location_latitude, location_longitude):
#     try:
#         api_url = f"https://nominatim.openstreetmap.org/reverse?lat={location_latitude}&lon={location_longitude}&format=geocodejson"

#         response = requests.get(api_url)

#         result = response.json()
#         print(result)
#         suburb = f"{result['address']['suburb']}, {result['address']['state']}"
#         return suburb

#     except requests.exceptions.RequestException as e:
#         print('Error fetching data:', e)

# # Example usage
# location_latitude = 123.456  # Replace with your latitude
# location_longitude = 78.910  # Replace with your longitude
# suburb = get_suburb(location_latitude, location_longitude)
# print('Suburb:', suburb)

from geopy.geocoders import Nominatim

def get_suburb(latitude: float, longitude: float) -> str:
    """
    Returns the suburb of the given latitude and longitude. left indicates the suburb (or city), right indicates the state.
    """
    geolocator = Nominatim(user_agent="Finding_Neno")
    coordinates = f"{latitude}, {longitude}"
    address = geolocator.reverse(coordinates, addressdetails=True)

    if address is not None:
        address = address.raw["address"]
        left, right = None, None

        if "suburb" in address:
            left = address["suburb"]
        else:
            if "city" in address:
                left = address["city"]
        
        if "state" in address:
            right = address["state"]

        if right is not None:
            if left is not None:
                return f"{left}, {right}"
            else:
                return right
        else:
            if left is not None:
                return left

    else:
        print("Location not found")

    return "Location not available"
    