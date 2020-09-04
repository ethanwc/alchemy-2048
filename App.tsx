import React from 'react';
import {StyleSheet, View, FlatList, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import GestureRecognizer from 'react-native-swipe-gestures';
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3rda1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471fr-bd96-145571ed9d72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-46c2-caed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aaa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-1f45571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471d96-145571ed9d72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c6-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571ed72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-46c2-ae-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3a68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571edd72',
    title: 'Third Item',
  },
];
const App = () => {
  const RenderItem = (props: any) => {
    return <View style={styles.item}></View>;
  };
  const RenderItem2 = (props: any) => {
    // console.error(props.props);
    return (
      <View
        style={{
          backgroundColor: 'purple',
          marginHorizontal: wp('1.2%'),
          marginVertical: wp('1.2%'),
          height: wp('22%'),
          width: wp('22%'),
          position: 'absolute',
          translateX:
            wp('1.2%') +
            wp('2.4%') * props.props.position.x +
            wp('22%') * props.props.position.x,
          translateY:
            wp('1.2%') +
            wp('2.4%') * props.props.position.y +
            wp('22%') * props.props.position.y,
        }}></View>
    );
  };

  const handleSwipe = (direction: string) => {
    switch (direction) {
      case 'SWIPE_UP':
        console.log('swipe up');
    }
  };

  interface Element {
    id: String;
    combinesWith: Array<String>;
    value: number;
    position: {x: number; y: number};
  }

  // let state = Array(4)
  //   .fill(null)
  //   .map(() => Array<Element | null>(4).fill(null));

  let state = Array(16).fill(null);

  state[0] = {
    id: 'water',
    combinesWith: ['water', 'ice'],
    value: 2,
    position: {x: 1, y: 1},
  };

  state[1] = {
    id: 'water',
    combinesWith: ['water', 'ice'],
    value: 2,
    position: {x: 3, y: 3},
  };

  state[5] = {
    id: 'water',
    combinesWith: ['water', 'ice'],
    value: 2,
    position: {x: 0, y: 0},
  };

  state[6] = {
    id: 'water',
    combinesWith: ['water', 'ice'],
    value: 2,
    position: {x: 2, y: 2},
  };

  console.log(state);
  console.log(state[0].position);

  return (
    <GestureRecognizer onSwipe={(direction) => handleSwipe(direction)}>
      <View style={{backgroundColor: 'grey'}}>
        <View style={styles.container}>
          {/* Render the game board */}
          <FlatList
            data={DATA}
            numColumns={4}
            renderItem={({item}) => (
              <RenderItem id={item.id} title={item.title} />
            )}
            keyExtractor={(item) => item.title}
            decelerationRate={0.798}
            showsHorizontalScrollIndicator={false}
          />
          {/* Render the tiles */}
          {state.map((item: any, index) => {
            if (item && item.position) {
              console.log(item.position.x);
              return <RenderItem2 props={item} />;
            }
            item && item.position ? <RenderItem2 element={item} /> : null;
          })}
        </View>
      </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: wp('1.2%'),
    paddingVertical: wp('1.2%'),
    marginVertical: wp('50%'),
    backgroundColor: '#bbada0',
  },
  textWrapper: {
    height: hp('100%'),
    width: wp('100%'),
  },
  myText: {
    fontSize: hp('5%'),
  },
  item: {
    backgroundColor: '#cdc0b4',
    marginHorizontal: wp('1.2%'),
    marginVertical: wp('1.2%'),
    height: wp('22%'),
    width: wp('22%'),
  },
  item2: {
    backgroundColor: 'purple',
    marginHorizontal: wp('1.2%'),
    marginVertical: wp('1.2%'),
    height: wp('22%'),
    width: wp('22%'),
    position: 'absolute',
    translateX: wp('1.2%'),
    translateY: wp('1.2%'),
  },
  title: {
    fontSize: 32,
  },
});

export default App;
