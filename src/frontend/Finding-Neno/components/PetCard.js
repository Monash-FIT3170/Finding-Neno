import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image, Text, Box } from "native-base";

const PetCard = ({ color, pet, onClick, editMode }) => {
  const petImage = pet.image_url;
  const petName = pet.name;
  const petType = pet.animal;
  const petBreed = pet.breed;
  const petDescription =
    pet.description.length > 50
      ? pet.description.substring(0, 50) + "..."
      : pet.description;

  const descriptionHeight =
    pet.description.length > 50 && !editMode ? petDescription.length * 0.5 : 0;

  return (
    <TouchableOpacity
      activeOpacity={editMode ? 0.6 : 1}
      onPress={editMode ? onClick : null}
    >
      <Box
        backgroundColor={color}
        borderTopLeftRadius={20}
        borderBottomRightRadius={20}
        height={150 + descriptionHeight}
        marginBottom={4}
        style={{ opacity: editMode ? 0.8 : 1, borderRadius: 20, overflow: "hidden" }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: "35%", height: "100%" }}>
              {petImage && (
                <Image
                  source={{ uri: petImage }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderTopLeftRadius: 20,
                  }}
                  alt="pet"
                />
              )}
            </View>

            <View style={{ flex: 1, marginLeft: "5%", padding: "2%" }}>
              <Text style={{ fontSize: 25, paddingBottom: 10, paddingTop: 10 }}>
                {petName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 8,
                }}
              >
                <View style={{ flexDirection: "column"}}>
                  <Text style={{ fontSize: 12, color: "#F2F2F7" }}>
                    Species:
                  </Text>
                  <Text style={{ fontSize: 16, textTransform: "capitalize" }}>
                    {petType}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    marginLeft: "20%",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Breed:</Text>
                  <Text style={{ fontSize: 16 }}>{petBreed}</Text>
                </View>
              </View>
              {!editMode && (
                <>
                  <Text style={{ fontSize: 12, color: "#F2F2F7", marginBottom: "1%" }}>
                    Details:
                  </Text>
                  <Text style={{ fontSize: 14 }}>{petDescription}</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <Box h="4"></Box>
      </Box>
    </TouchableOpacity>
  );
};

export default PetCard;