import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import tw from 'twrnc';
import api from '../../utils/api';

const queryClient = new QueryClient();

const fetchProperties = async () => {
  const res = await api.get('/properties');
  return res.data;
};

function HomeScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const filtered = properties.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <View style={tw`flex-1 justify-center items-center`}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
  if (error) return <Text style={tw`text-center mt-8`}>Error loading properties</Text>;

  return (
    <View style={tw`flex-1 bg-white p-4 pt-14`}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-200 text-base`}
        placeholder="Search properties..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#111"
      />
      {filtered.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>No results found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const location = item.location
              ? `${item.location.address}, ${item.location.city}, ${item.location.state}`
              : '';
            const imageUrl = item.images && item.images.length > 0 ? item.images[0] : undefined;
            return (
              <Pressable style={tw`mb-4 p-4 border rounded bg-gray-100 border-gray-200`} onPress={() => router.push({
                pathname: '/property/details',
                params: { property: encodeURIComponent(JSON.stringify(item)) },
              })}>
                {imageUrl && (
                  <Image
                    source={{ uri: imageUrl }}
                    style={tw`w-full h-44 rounded-lg mb-2`}
                    resizeMode="cover"
                  />
                )}
                <Text style={tw`text-lg font-bold mb-1`}>{item.title}</Text>
                <Text style={tw`text-gray-700`}>{location}</Text>
                <Text style={tw`text-gray-500`}>${item.price}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeScreen />
    </QueryClientProvider>
  );
}
