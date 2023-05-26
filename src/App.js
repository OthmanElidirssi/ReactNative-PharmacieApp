
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Search from './Search';
import Map from './Map';

const Drawer=createDrawerNavigator();


export default function App() {
  return (
        <NavigationContainer>
          <Drawer.Navigator>
              <Drawer.Screen name='Search' component={Search}/>
              <Drawer.Screen name='Map' component={Map}/>
          </Drawer.Navigator>
        </NavigationContainer>
  );
}

