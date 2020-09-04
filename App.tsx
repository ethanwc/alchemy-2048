import React, {useRef} from 'react';
import {Animated, FlatList, StyleSheet, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28b1a',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa972f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3rda1-471f-bd96-145571e329d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471fr-bd96-145571e4d9d72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-46c2-caed55-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a64f8-fbd91aaa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd976-1f45571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471d96-1845571ed9d72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-46c21-aed5-53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c36-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da41-471bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-3471f-bd96-145571ed72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-416c2-ae-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3a68af1c-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a20f-3da-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-1435571edd72',
    title: 'Third Item',
  },
];
const App = () => {
  interface Element {
    id: String;
    combinesWith: Array<String>;
    value: number;
    position: {x: number; y: number};
    moveAnimation: any;
  }

  let state = Array<Element | null>(16).fill(null);

  const moveAnimation0 = new Animated.ValueXY({
    x: wp('1.2%') + wp('24.4%') * 2,
    y: wp('1.2%') + +wp('24.4%') * 3,
  });

  state[0] = {
    id: 'water',
    combinesWith: ['water', 'ice'],
    value: 2,
    position: {x: 2, y: 2},
    moveAnimation: moveAnimation0,
  };

  const RenderItem = (props: any) => {
    return <View style={styles.item}></View>;
  };

  /**
   * Determine where to move tiles
   */
  const calculateMoves = () => {
    // const swipeDirection = 'LEFT';
    // let boardState = Array.from(Array(4), () => new Array(4));
    // state.forEach((item: Element | null) => {
    //   if (item) {
    //     boardState[item.position.x][item.position.y] = item;
    //   }
    // });

    // let l1: any = [];
    // let l2: any = [];
    // let l3: any = [];
    // let l4: any = [];

    // boardState[0].forEach((item: Element | null, index: number) => {
    //   if (item) {
    //     let item2 = item;
    //     item2.position = {x: 0, y: index};
    //     item2.animation = Animated.timing(moveAnimation1, {
    //       toValue: {
    //         x: wp('1.2%') + wp('24.4%') * index,
    //         y: wp('1.2%') + wp('24.4%') * index,
    //       },
    //       duration: 200,
    //       useNativeDriver: false,
    //     });

    //     l1.push(item2);
    //   }
    // });

    // l1 = [...l1, ...Array(4 - l1.length).fill(undefined)];
    // l2 = [...l2, ...Array(4 - l2.length).fill(undefined)];
    // l3 = [...l3, ...Array(4 - l3.length).fill(undefined)];
    // l4 = [...l4, ...Array(4 - l4.length).fill(undefined)];

    // // console.error(boardState);
    // // console.error([l1, l2, l3, l4]);
    // state = [...l1, ...l2, ...l3, ...l4];
    state.forEach((item: Element | null, index: number) => {
      if (item) {
        animation: Animated.timing(item.moveAnimation, {
          toValue: {
            x: wp('1.2%') + wp('24.4%') * 2,
            y: wp('1.2%') + wp('24.4%') * 0,
          },
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    });

    // switch (swipeDirection) {
    //   case 'LEFT':
    // }
    // calculate new board state, set new animation for the objects then call parallel animate
  };

  const moveAnimation1 = new Animated.ValueXY({
    x: wp('1.2%') + wp('24.4%') * 1,
    y: wp('1.2%') + +wp('24.4%') * 1,
  });

  const moveAnimation2 = new Animated.ValueXY({
    x: wp('1.2%') + wp('24.4%') * 1,
    y: wp('1.2%') + +wp('24.4%') * 1,
  });

  const handleSwipe = (direction: string) => {
    switch (direction) {
      case 'SWIPE_LEFT':
        break;
      case 'SWIPE_RIGHT':
        console.log('swipe right');
        // if (state[0]) console.log(state[0].animation);
        break;
      case 'SWIPE_UP':
        console.log('swipe up');
        calculateMoves();
        break;
      case 'SWIPE_DOWN':
        console.log('swipe down');
        break;
    }
  };

  return (
    // Listen for gesture input
    <GestureRecognizer onSwipe={(direction, state) => handleSwipe(direction)}>
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
          <View style={{position: 'absolute'}}>
            <Animated.View style={[state[0].moveAnimation.getLayout()]}>
              <View
                style={{
                  backgroundColor: 'grey',
                  margin: wp('1.2%'),
                  width: wp('22%'),
                  height: wp('22%'),
                }}
              />
            </Animated.View>
          </View>
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
    transform: [
      {translateX: wp('1.2%')},
      {
        translateY: wp('1.2%'),
      },
    ],
  },
  title: {
    fontSize: 32,
  },
});

export default App;
