import { getProfile } from "@/utils/api";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

const queryClient = new QueryClient();

const fetchProfile = async () => {
  return await getProfile();
  // const res = await api.get('/profile');
  // return res.data;
};

function ProfileScreen() {
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  if (isLoading)
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg`}>Loading...</Text>
      </View>
    );
  if (error || !profile)
    return (
      <Text style={tw`justify-center items-center text-center mt-8`}>
        Error loading profile
      </Text>
    );

  return (
    <ScrollView style={tw`flex-1 bg-white p-4 pt-14`}>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"} />
      <View style={tw`items-center mb-6`}>
        <Image
          source={{ uri: profile.avatar }}
          style={tw`w-28 h-28 rounded-full mb-3`}
        />
        <Text style={tw`text-xl font-bold`}>{profile.name}</Text>
        <Text style={tw`text-gray-500 mb-2`}>{profile.email}</Text>
        <Text
          style={tw`text-gray-500 mb-2`}
          onPress={() => Linking.openURL(`tel:${profile.phone}`)}
        >
          {profile.phone}
        </Text>
        <View style={tw`mb-2 flex-row`}>
          <Text style={tw`text-gray-500`}>{profile.location} |</Text>
          <Text
            style={tw`text-gray-500`}
            onPress={() => Linking.openURL(profile.portfolio)}
          >
            {" "}
            Portfolio
          </Text>
        </View>
        <Text style={tw`text-center text-sm mb-2`}>{profile.bio}</Text>
      </View>
      <Text style={tw`text-2xl font-bold mb-4`}>Socials:</Text>
      <View style={tw`mb-4 flex-row`}>
        <TouchableOpacity
          style={tw`items-center mb-1`}
          onPress={() => Linking.openURL(profile.socials.github)}
        >
          <FontAwesome name="github" size={28} color="#333" style={tw`mr-2`} />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`items-center mb-1`}
          onPress={() => Linking.openURL(profile.socials.linkedin)}
        >
          <FontAwesome
            name="linkedin"
            size={28}
            color="#0077b5"
            style={tw`mr-2`}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`items-center mb-1`}
          onPress={() => Linking.openURL(profile.socials.twitter)}
        >
          <FontAwesome6
            name="x-twitter"
            size={28}
            color="black"
            style={tw`mr-2`}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileScreen />
    </QueryClientProvider>
  );
}
