import { useBookingStore } from "@/store/bookingStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import tw from "twrnc";

const { width } = Dimensions.get("window");

export const screenOptions = {
  headerShown: false,
};

export default function PropertyDetails() {
  const { property } = useLocalSearchParams();
  const data = property
    ? JSON.parse(decodeURIComponent(property as string))
    : null;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const userId = useBookingStore((state) => state.userId);

  if (!data) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg`}>No property data found.</Text>
      </View>
    );
  }

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
    setActiveIndex(index);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"} />
      <View style={tw`flex-row items-center px-4 pt-14 pb-4 bg-white`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-3 p-1`}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Property Details</Text>
      </View>
      <ScrollView>
        {data.images && data.images.length > 0 && (
          <View style={tw`px-4`}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={tw`mb-2`}
            >
              {data.images.map((img: string, idx: number) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  style={{
                    width: width - 32,
                    height: 220,
                    borderRadius: 12,
                    marginRight: 8,
                  }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View style={tw`flex-row justify-center mt-2 mb-4`}>
              {data.images.map((_: string, idx: number) => (
                <View
                  key={idx}
                  style={[
                    tw`mx-1 rounded-full`,
                    {
                      width: 8,
                      height: 8,
                      backgroundColor:
                        activeIndex === idx ? "black" : "#d1d5db",
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}
        <View style={tw`px-4 mb-12`}>
          <Text style={tw`text-2xl font-bold mb-2`}>{data.title}</Text>
          <Text style={tw`text-gray-700 mb-2`}>
            {data.location.address}, {data.location.city}, {data.location.state}
          </Text>
          {data.location?.coordinates && (
          <View style={tw`mt-4 mb-2 rounded-lg overflow-hidden`}>
            <Text style={tw`font-bold mb-2`}>Location:</Text>
            <MapView
              style={{ width: "100%", height: 200 }}
              initialRegion={{
                latitude: data.location.coordinates.latitude,
                longitude: data.location.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              mapType={Platform.OS == "android" ? "none" : "standard"}
              scrollEnabled={true}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: data.location.coordinates.latitude,
                  longitude: data.location.coordinates.longitude,
                }}
                title={data.title}
                description={data.location.address}
              />
            </MapView>
          </View>
        )}
          <Text style={tw`text-lg text-gray-500 mb-2`}>${data.price}</Text>
          <Text style={tw`font-bold mb-2`}>Features:</Text>
          {data.features &&
            data.features.map((feature: string, idx: number) => (
              <Text key={idx} style={tw`ml-2 mb-1`}>
                • {feature}
              </Text>
            ))}

            <TouchableOpacity
            style={tw`mt-6 bg-black py-3 rounded-lg items-center shadow-lg px-4`}
            onPress={() => {
              useBookingStore.getState().addBooking({
                id: Date.now().toString(),
                propertyId: data.id,
                userId: userId,
                checkIn: new Date().toISOString().slice(0, 10),
                checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                status: 'pending',
              });
              alert('Booking added!');
            }}
          >
            <Text style={tw`text-white font-bold text-lg`}>Book Now</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
      </View>
  );
}
