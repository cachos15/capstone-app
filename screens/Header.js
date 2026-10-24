import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const Header = ({
  navigation,
  showGoBack = false,
  showProfilePicture = false,
}) => {
  const canGoBack = navigation?.canGoBack?.() ?? false;

  return (
    <View style={styles.container}>
        {showGoBack && (
          <Pressable
            style={styles.backButton}
            onPress={() => canGoBack ? navigation.goBack() : navigation.navigate('Onboarding')}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        )}
        <Image 
            style={styles.image}
            source={require('../assets/Logo.png')}
            resizeMode="contain"
        />
        {showProfilePicture && (
          <Image 
            style={styles.profileImage}
            source={require('../assets/Profile.png')}
            resizeMode="contain"
          />
        )}
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#DEE3E9',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 220,
    height: 75,
    borderRadius: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#495E57',
  },
  backText: {
    color: '#EDEFEE',
    fontSize: 32,
    lineHeight: 36,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  }
});
