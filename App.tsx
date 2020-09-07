import React, {useRef, useState, useEffect} from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Easing,
  Image,
  Button,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// check for collisions based on swipe direction
// mark upgrade to based on collision, mark other for deletion
// perform swipe to same target xy
// delete entities, upgrade entities

// swipe left
// put everything into a queue
// pop first item
// can second item collide? no - put first back, yes - collide and put first into result, ignore second.
// third is null, fourth can slide over null, pop next actual item, then fill end with x slots null which is 2 for this scenario

const App = () => {
  interface Element {
    id: String;
    value: number;
    collidesWith: Array<String>;
    position: {x: number; y: number};
    moveAnimation: any;
    colliding: boolean;
    upgrade: {id: String; delete: boolean};
  }

  let images = Object.fromEntries([
    ['fire', require('./images/fire.png')],
    ['water', require('./images/water.png')],
  ]);

  const ElementView = (props: any) => {
    return (
      <View style={{position: 'absolute'}}>
        <Animated.View style={[props.item.moveAnimation.getLayout()]}>
          <View
            style={{
              backgroundColor: '#eee4da',
              margin: wp('1.2%'),
              width: wp('22%'),
              height: wp('22%'),
            }}>
            <Image
              source={images[props.item.id]}
              style={{width: '100%', height: '100%'}}
            />
          </View>
        </Animated.View>
      </View>
    );
  };

  const ElementView2 = (props: any) => {
    return (
      <View style={{position: 'absolute'}}>
        <Animated.View style={animatedStyles}>
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

  let [state, setState] = useState(Array<Element | null>(16).fill(null));

  useEffect(() => {
    let temp_state = Array<Element | null>(16).fill(null);

    temp_state[0] = {
      id: 'water',
      collidesWith: ['water', 'ice'],
      value: 2,
      position: {x: 0, y: 0},
      moveAnimation: new Animated.ValueXY({
        x: wp('1.2%') + wp('24.4%') * 0,
        y: wp('1.2%') + wp('24.4%') * 0,
      }),
      colliding: false,
      upgrade: {id: 'fire', delete: false},
    };
    temp_state[1] = {
      id: 'fire',
      collidesWith: ['fire', 'ice'],
      value: 2,
      position: {x: 3, y: 3},
      moveAnimation: new Animated.ValueXY({
        x: wp('1.2%') + wp('24.4%') * 3,
        y: wp('1.2%') + wp('24.4%') * 3,
      }),
      colliding: false,
      upgrade: {id: 'fire', delete: false},
    };
    temp_state[3] = {
      id: 'water',
      collidesWith: ['water', 'ice'],
      value: 2,
      position: {x: 0, y: 1},
      moveAnimation: new Animated.ValueXY({
        x: wp('1.2%') + wp('24.4%') * 1,
        y: wp('1.2%') + wp('24.4%') * 0,
      }),
      colliding: false,
      upgrade: {id: 'fire', delete: false},
    };
    setState(temp_state);
  }, []);

  // state[1] = {
  //   id: 'fire',
  //   collidesWith: ['fire'],
  //   value: 2,
  //   position: {x: 2, y: 2},
  //   moveAnimation: new Animated.ValueXY({
  //     x: wp('1.2%') + wp('24.4%') * 2,
  //     y: wp('1.2%') + wp('24.4%') * 2,
  //   }),
  //   colliding: false,
  //   upgrade: {id: 'water', delete: false},
  // };

  // state[6] = {
  //   id: 'fire',
  //   collidesWith: ['fire'],
  //   value: 2,
  //   position: {x: 3, y: 3},
  //   moveAnimation: new Animated.ValueXY({
  //     x: wp('1.2%') + wp('24.4%') * 3,
  //     y: wp('1.2%') + wp('24.4%') * 3,
  //   }),
  //   colliding: false,
  //   upgrade: {id: 'water', delete: false},
  // };

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
        // console.log('left?');
        // calculate new spots
        updatedBoard = rows.map((row: Array<Array<Element | null>>) => {
          return [...row, ...Array(4 - row.length).fill(null)];
        });

        // whiteboard

        // check for collisions for elements to the left
        // for each row from left to right, if the element to the right is the same id and it is not currently colliding,
        // set it and self to collide and to the left element coords, mark second element to delete, mark first element to upgrade
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

    // console.error(updatedBoard[0][0]);

    if (updatedBoard !== null) {
      for (let y = 0; y < updatedBoard.length; y++) {
        for (let x = 0; x < updatedBoard.length; x++) {
          if (updatedBoard[x][y] !== null && updatedBoard[x][y] !== undefined) {
            if (!updatedBoard[x][y]?.colliding) {
              updatedBoard[x][y]!.position = {x: x, y: y};
            } else {
              // is colliding
              if (updatedBoard[x][y]!.upgrade.delete === true) {
                // updatedBoard[x][y] = null;
                // console.log(state);
                // colliding and upgrading
              } else {
                updatedBoard[x][y]!.colliding = false;
                updatedBoard[x][y]!.id = 'water';
                updatedBoard[x][y]!.upgrade = {id: 'fire', delete: false};
              }
            }
          }
        }
      }
    }

    let temp_state = [
      ...updatedBoard[0],
      ...updatedBoard[1],
      ...updatedBoard[2],
      ...updatedBoard[3],
    ];

    let nullCount = 0;

    state.forEach((item: any) => {
      if (item === null) {
        nullCount = nullCount + 1;
      }
    });

    // console.error(state);

    let animationQueue: Animated.CompositeAnimation[] = [];

    // console.error(state);
    temp_state.forEach((item: Element | null, index: number) => {
      if (item) {
        state;
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

    setState(temp_state);
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
    duration: 50,
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
    inputRange: [0, 2],
    outputRange: [0, 100],
  });

  const animatedStyles = [
    {
      opacity,
      width: size,
      height: 111,
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
              keyExtractor={(item) => Math.random().toString()}
              decelerationRate={0.798}
              showsHorizontalScrollIndicator={false}
            />

            {state.map((item: Element | null, index: number) => {
              return item !== null ? <ElementView item={item} /> : null;
            })}
          </View>
          <Button
            title={'Clear state'}
            onPress={() => {
              setState(Array<Element | null>(16).fill(null));
            }}
          />
        </View>
        {/* <View style={styles.container}>
          <TouchableOpacity onPress={() => animate(Easing.bounce)}>
            <View style={styles.boxContainer}>
              <ElementView2
                item={{
                  id: 'fire',
                  collidesWith: ['fire'],
                  value: 2,
                  position: {x: 0, y: 0},
                  moveAnimation: new Animated.ValueXY({
                    x: 0,
                    y: 0,
                  }),
                }}
              />
            </View>
          </TouchableOpacity>
        </View> */}
      </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: wp('1.2%'),
    paddingVertical: wp('1.2%'),
    marginVertical: wp('25%'),
    backgroundColor: '#bbada0',
  },
  box: {
    marginTop: 32,
    borderRadius: 4,
    backgroundColor: '#cdc1b4',
  },
  boxContainer: {
    height: 160,
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#cdc1b4',
    marginHorizontal: wp('1.2%'),
    marginVertical: wp('1.2%'),
    height: wp('22%'),
    width: wp('22%'),
  },
});

export default App;
