import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Map({ route }) {

  route.params = route.params || { data: "" };
  const first = route.params.data && route.params.data[0];
  const pharmacies = route.params.data || [];
  const latitudeDelta = first ? 0.09 : 130;
  const longitudeDelta = first ? 0.09 : 130;

  const [selectedMarker, setSelectedMarker] = useState(null);
  const infoBottomPosition = useRef(new Animated.Value(0)).current;

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    animateInfoView(1);
  };

  const handleInfoClose = () => {
    animateInfoView(0);
    setSelectedMarker(null);
  };

  const animateInfoView = (toValue) => {
    Animated.spring(infoBottomPosition, {
      toValue: toValue,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    setSelectedMarker(null);
  }, [route]);

  return (
    <View style={styles.container}>
      <MapView
        key={first === undefined ? Math.random() : first._id}
        style={styles.map}
        initialRegion={{
          latitude: first ? first.latitude : 1.6508,
          longitude: first ? first.longitude : 18.5944,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
      >
        {pharmacies.map((item) => (
          <Marker
            key={item?._id}
            coordinate={{
              latitude: item?.latitude || 0,
              longitude: item?.longitude || 0,
            }}
            onPress={() => handleMarkerPress(item)}
          />
        ))}
      </MapView>
      {selectedMarker && (
        <Animated.View
          style={[
            styles.infoContainer,
            { bottom: infoBottomPosition.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) },
          ]}
        >
          {selectedMarker && selectedMarker.image && (
            <Image source={{ uri: selectedMarker.image }} style={styles.image} />
          )}

          <Text style={styles.infoText}>
            <Text style={styles.strong}>Nom: </Text>
            {selectedMarker.nom}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.strong}>Adresse: </Text>
            {selectedMarker.adresse}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.strong}>Garde: </Text>
            {selectedMarker.gardes.map((element) => element.type).join(" et ")}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleInfoClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
  },
  strong: {
    color:"#0275d8",
    fontWeight: 'bold',
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 16,
  }, 
  infoText: {
    marginBottom: 8,
    fontSize: 16,
  },
});
