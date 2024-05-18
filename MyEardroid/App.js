import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import config from './src/config';
import { routes } from './src/routes';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={config.routes.home}>
        {routes && 
          routes.map((route, index) => (
            <Stack.Screen key={index} name={route.name} component={route.component} options={route.options} />
          ))
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

