import React, {useRef} from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Easing,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const App = () => {
  interface Element {
    id: String;
    combinesWith: Array<String>;
    value: number;
    position: {x: number; y: number};
    moveAnimation: any;
  }

  const ElementView = (props: any) => {
    return (
      <View style={{position: 'absolute'}}>
        <Animated.View style={[props.item.moveAnimation.getLayout()]}>
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
    );
  };

  const BackgroundTile = () => {
    return <View style={styles.item} />;
  };

  let state = Array<Element | null>(16).fill(null);

  state[0] = {
    id: 'water',
    combinesWith: ['water', 'ice'],
    value: 2,
    position: {x: 0, y: 0},
    moveAnimation: new Animated.ValueXY({
      x: wp('1.2%') + wp('24.4%') * 0,
      y: wp('1.2%') + wp('24.4%') * 0,
    }),
  };
  state[3] = {
    id: 'water',
    combinesWith: ['water', 'ice'],
    value: 2,
    position: {x: 0, y: 1},
    moveAnimation: new Animated.ValueXY({
      x: wp('1.2%') + wp('24.4%') * 1,
      y: wp('1.2%') + wp('24.4%') * 0,
    }),
  };
  state[1] = {
    id: 'fire',
    combinesWith: ['fire'],
    value: 2,
    position: {x: 2, y: 2},
    moveAnimation: new Animated.ValueXY({
      x: wp('1.2%') + wp('24.4%') * 2,
      y: wp('1.2%') + wp('24.4%') * 2,
    }),
  };

  state[6] = {
    id: 'fire',
    combinesWith: ['fire'],
    value: 2,
    position: {x: 3, y: 3},
    moveAnimation: new Animated.ValueXY({
      x: wp('1.2%') + wp('24.4%') * 3,
      y: wp('1.2%') + wp('24.4%') * 3,
    }),
  };

  /**
   * Invert an array - used for vertical reallignment
   */
  const invert = (positions: any) => {
    let result: any[] = [];

    for (let i = 0; i < 4; i++) {
      let temp11: any = [];
      for (let j = 0; j < 4; j++) {
        temp11.push(positions[j][i]);
      }
      result.push(temp11);
    }
    return result;
  };

  /**
   * Determine where to move tiles
   */
  const calculateMoves = (swipeDirection: string) => {
    let boardState = Array.from(Array(4), () => new Array(4));
    state.forEach((item: Element | null) => {
      if (item !== null) {
        boardState[item.position.x][item.position.y] = item;
      }
    });

    //todo: button on press spring animation
    let rows = Array.from(Array(4), () => new Array());
    let columns = Array.from(Array(4), () => new Array());

    boardState.forEach((arr: Array<Element | null>, arrIndex: number) => {
      for (let r = 0; r < 4; r++) {
        if (arr[r] !== null && arr[r] !== undefined) {
          columns[r].push(arr[r]);
        }
      }
    });

    boardState.forEach((arr: Array<Element | null>, arrIndex: number) =>
      arr.forEach((item: Element | null) => {
        if (item !== null && item !== undefined) rows[arrIndex].push(item);
      }),
    );

    let updatedBoard: Array<Array<Element | null>> = [[]];

    switch (swipeDirection) {
      case 'DOWN':
        let downdatedPositions: any = columns.map(
          (column: Array<Element | null>) => {
            return [
              ...column.reverse(),
              ...Array(4 - column.length).fill(null),
            ].reverse();
          },
        );

        updatedBoard = invert(downdatedPositions);
        break;

      case 'UP':
        let updatedPositions: any = columns.map(
          (column: Array<Element | null>) => {
            return [...column, ...Array(4 - column.length).fill(null)];
          },
        );

        updatedBoard = invert(updatedPositions);
        break;

      case 'LEFT':
        updatedBoard = rows.map((row: Array<Array<Element | null>>) => {
          return [...row, ...Array(4 - row.length).fill(null)];
        });
        break;
      case 'RIGHT':
        updatedBoard = rows.map((row: Array<Array<Element | null>>) => {
          return [
            ...row.reverse(),
            ...Array(4 - row.length).fill(null),
          ].reverse();
        });
        break;
    }

    if (updatedBoard !== null) {
      for (let y = 0; y < updatedBoard.length; y++) {
        for (let x = 0; x < updatedBoard.length; x++) {
          if (updatedBoard[x][y] !== null && updatedBoard[x][y] !== undefined) {
            updatedBoard[x][y].position = {x: x, y: y};
          }
        }
      }
    }

    state = [
      ...updatedBoard[0],
      ...updatedBoard[1],
      ...updatedBoard[2],
      ...updatedBoard[3],
    ];

    let animationQueue: Animated.CompositeAnimation[] = [];

    state.forEach((item: Element | null, index: number) => {
      if (item) {
        animationQueue.push(
          Animated.timing(item.moveAnimation, {
            toValue: {
              x: wp('1.2%') + wp('24.4%') * item.position.y,
              y: wp('1.2%') + wp('24.4%') * item.position.x,
            },
            duration: 100,
            useNativeDriver: false,
          }),
        );
        item.position = {x: item.position.x, y: item.position.y}; // x and y flipped?
      }
    });

    // Start all tile moves at the same time
    Animated.parallel(animationQueue).start();
  };

  const handleSwipe = (direction: string) => {
    switch (direction) {
      case 'SWIPE_LEFT':
        calculateMoves('LEFT');
        break;
      case 'SWIPE_RIGHT':
        calculateMoves('RIGHT');
        break;
      case 'SWIPE_UP':
        calculateMoves('UP');
        break;
      case 'SWIPE_DOWN':
        calculateMoves('DOWN');
        break;
    }
  };

  let width = new Animated.Value(100);
  const endWidth = 40;
  let a = Animated.timing(width, {
    toValue: endWidth,
    useNativeDriver: false,
    duration: 200,
    easing: Easing.linear,
  });
  let opacity = new Animated.Value(0);

  const animate = (easing: any) => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      useNativeDriver: false,
      duration: 400,
      easing,
    }).start();
  };

  const size = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });
  const animatedStyles = [
    styles.box,
    {
      // opacity,
      width: size,
      height: size,
    },
  ];
  return (
    // Listen for gesture input
    <GestureRecognizer onSwipe={(direction, _) => handleSwipe(direction)}>
      <View>
        <View style={{backgroundColor: 'grey'}}>
          <View style={styles.container}>
            <FlatList
              data={Array(16).fill('')}
              numColumns={4}
              renderItem={({item}) => <BackgroundTile />}
              keyExtractor={(item) => item.title}
              decelerationRate={0.798}
              showsHorizontalScrollIndicator={false}
            />

            {state.map((item: Element | null, index: number) => {
              return item !== null ? <ElementView item={item} /> : null;
            })}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => animate(Easing.elastic(2))}
          style={{position: 'absolute'}}>
          <View style={styles.boxContainer}>
            <Animated.View style={animatedStyles} />
          </View>
        </TouchableOpacity>
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
  box: {
    marginTop: 32,
    borderRadius: 4,
    backgroundColor: '#61dafb',
  },
  boxContainer: {
    height: 160,
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#cdc0b4',
    marginHorizontal: wp('1.2%'),
    marginVertical: wp('1.2%'),
    height: wp('22%'),
    width: wp('22%'),
  },
});

export default App;
