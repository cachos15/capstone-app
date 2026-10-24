import { Alert, StyleSheet, Text, View, FlatList, Image, Pressable } from 'react-native';
import Header from './Header';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createTable, getMenuItems, saveMenuItems, filterByCategories } from '../database';

const filters = ['Starters', 'Mains', 'Desserts', 'Drinks'];
const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const menuImages = {
  'bruschetta.jpg': require('../assets/bruschetta.png'),
  'greekSalad.jpg': require('../assets/greekSalad.png'),
  'grilledFish.jpg': require('../assets/grilledFish.png'),
  'lemonDessert.jpg': require('../assets/lemonDessert.png'),
  'pasta.jpg': require('../assets/pasta.png'),
};
const Item = ({ name, description, price, image }) => (
  <View style={styles.innerContainer}>
    <Text style={styles.itemTitle}>{name}</Text>
    <View style={styles.descriptionContainer}>
      <View style={styles.infoContainer}>
      <Text style={styles.itemDescription} numberOfLines={2}>{description}</Text>
      <Text style={styles.itemPrice}>{price}</Text>
      </View>
      <Image
        source={menuImages[image]}
        style={styles.itemImage}
        resizeMode="contain"

      />
    </View>
  </View>
);

const Home = ({ navigation }) => {

  const [data, setData] = useState([]);
  const [activeFilters, setActiveFilters] = useState(/** @type {string[]} */ ([]));

const filterData = async(filter) => {
  try {
    const nextFilters = activeFilters.includes(filter)
      ? activeFilters.filter((activeFilter) => activeFilter !== filter)
      : [...activeFilters, filter];

    setActiveFilters(nextFilters);

    const filtered = nextFilters.length
      ? await filterByCategories(nextFilters)
      : await getMenuItems();
    setData(filtered);
  } catch (error) {
    console.error('Error filtering data', error);
  }
};

const fetchData = async() => {
  try { 
    const response = await fetch(API_URL);
    const json = await response.json();
    setData(json.menu);
    return json.menu;
  } catch (error) {
    console.error('error fetching data',error);
  }
    return [];
  }

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          await saveMenuItems(menuItems);
        } else {
          setData(menuItems);
        }
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  const renderItem = ({ item }) => <Item name={item.name} description={item.description} price={item.price} image={item.image} />;

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        showProfilePicture
      />

      <View style={styles.descriptionContent}>
        <Text style={styles.descriptionTitle}>Little Lemon</Text>
        <View style={styles.descriptionContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.descriptionLocation}>Chicago</Text>
            <Text style={styles.descriptionText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require('../assets/Hero image.png')}
            resizeMode="contain"
          />
        </View>
        <Pressable
          style={styles.findButton}
        >
          <MaterialIcons name="search" size={24} color="#495E57" />
        </Pressable>
      </View>
      
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>ORDER FOR DELIVERY!</Text>
        <View style={styles.filterButtonContainer}>
          {filters.map((filter) => (
            <Pressable
              style={[
                styles.filterButton,
                activeFilters.includes(filter) && styles.activeFilterButton
              ]}
              key={filter}
              onPress={()=>filterData(filter)}
            >
              <Text 
              style={[
                styles.filterButtonText,
                activeFilters.includes(filter) && styles.activeFilterButtonText
              ]}>{filter}</Text>
            </Pressable>
          ))}
        </View>

      </View>
      <FlatList
        style={styles.menu}
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  descriptionContent: {
    backgroundColor: '#495e57',
    paddingHorizontal: 20,
  },
  descriptionTitle: {
    color: '#F4CE14',
    fontSize: 32,
    marginTop: 20,
    fontWeight: 'bold',
  },
  descriptionLocation: {
    color: '#EDEFEE',
    fontSize: 24,
    marginTop: 10,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#EDEFEE',
    fontSize: 18,
    marginTop: 30,
    paddingBottom: 20,
  },
  menu: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#495e572c',
  },
  innerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  itemTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#495e572c',
  },
  infoContainer: {
    width: '60%',
    gap: 10,
  },
  itemDescription: {
    color: '#495E57',
    fontSize: 20,
  },
  itemPrice: {
    color: '#495E57',
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  heroImage: {
    width: 170,
    height: 170,
  },
  findButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#EDEFEE',
    marginBottom: 20,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  filterTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButtonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#495e5741',
    padding: 10,
    borderRadius: 15,
  },
  activeFilterButton: {
    backgroundColor: '#495e57',
    padding: 10,
    borderRadius: 15,
  },
  filterButtonText: {
    color: '#495e57',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeFilterButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default Home;