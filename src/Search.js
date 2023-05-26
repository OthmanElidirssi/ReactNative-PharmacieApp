import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView,Platform} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const pickerWidth = "75%";
const Search = ({ navigation }) => {
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedZone, setSelectedZone] = useState('');
    const [selectedOption, setSelectedOption] = useState('Jour');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isSelected, setIsSelected] = useState(true);

    useEffect(() => {
        fetch('https://motionless-blue-bee.cyclic.app/api/cities')
            .then((result) => result.json())
            .then((data) => {
                setCities(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleChangeCities = (cityId) => {

        setSelectedCity(cityId);
        const uri = `https://motionless-blue-bee.cyclic.app/api/zones/city/${cityId}`;
        fetch(uri)
            .then((result) => result.json())
            .then((data) => {
                setZones(data);
                setIsDisabled(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChangeZones = (zoneId) => {
        setSelectedZone(zoneId);
        setIsSelected(false);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        const uri = `https://motionless-blue-bee.cyclic.app/api/pharmacies/garde/${selectedOption}`;
        fetch(uri)
            .then((result) => result.json())
            .then((data) => {
                const finalArray = data.filter((element) => element.zone._id === selectedZone);

                navigation.navigate('Map', { data: finalArray });
            });
    };

    return (

        <View style={styles.container}>
            <View style={Platform.OS === 'android' ?styles.pickercontainer:styles.ios}>
                <Picker
                    selectedValue={selectedCity}
                    onValueChange={(itemValue) => handleChangeCities(itemValue)
                    }
                    style={Platform.OS === 'android' ? styles.picker:styles.ios}
                >
                    <Picker.Item label="Selectionner une Ville" value="" />
                    {cities.map((element) => (
                        <Picker.Item key={element._id} label={element.name} value={element._id} />
                    ))}
                </Picker>
            </View>
            <View  style={Platform.OS === 'android' ?styles.pickercontainer:styles.ios}>
                <Picker
                    selectedValue={selectedZone}
                    onValueChange={(itemValue) => handleChangeZones(itemValue)}
                    enabled={!isDisabled}
                    style={Platform.OS === 'android' ? styles.picker:styles.ios}
                >
                    <Picker.Item label="Selectionner une zone" value="" />
                    {zones.map((element) => (
                        <Picker.Item key={element._id} label={element.name} value={element._id} />
                    ))}
                </Picker>
            </View>
            <View  style={Platform.OS === 'android' ?styles.pickercontainer:styles.ios}>
                <Picker
                    selectedValue={selectedOption}
                    onValueChange={(itemValue) => handleOptionChange(itemValue)}
                    enabled={!isSelected}
                    style={Platform.OS === 'android' ? styles.picker:styles.ios}
                >
                    <Picker.Item label="Jour" value="Jour" />
                    <Picker.Item label="Nuit" value="Nuit" />
                </Picker>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Search" onPress={handleSubmit} disabled={isSelected} />
            </View>
        </View>
    )
}
export default Search;

const styles = StyleSheet.create({

    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',

    },
    picker: {
        width: pickerWidth,
        height: 40,
        width: '100%',
        color: 'black',
    },
    pickercontainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingBottom: 25,
        marginBottom: 20,
        marginTop: 15,
        alignContent: 'center',
        backgroundColor: 'white',
    },
    buttonContainer:{
        width: "100%",
        paddingHorizontal:10,
        marginTop:20,
    },
    ios:{
        width:"100%"
    }
})