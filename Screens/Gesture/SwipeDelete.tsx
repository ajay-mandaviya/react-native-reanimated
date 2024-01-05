import React, { useRef } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TITLES = [
  "Record the dismissible tutorial 🎥",
  "Leave 👍🏼 to the video",
  "Check YouTube comments",
  "Subscribe to the channel 🚀",
  "Leave a ⭐️ on the GitHub Repo",
];
interface TaskInterface {
  title: string;
  index: number;
}
const TASKS: TaskInterface[] = TITLES.map((title, index) => ({ title, index }));
const BACKGROUND_COLOR = "#FAFBFF";
const LIST_ITEM_HEIGHT = 70;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SwipeDelete = () => {
  const [tasks, setTasks] = React.useState(TASKS);
  const scrollRef = useRef(null);

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <ScrollView>
          <Text style={styles.title}>Task</Text>
          {tasks.map((task, _index) => (
            <ListItem key={_index} task={task} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

interface ListItemProps {
  onDismiss?: (task: TaskInterface) => void;
  task: TaskInterface;
}
const ListItem: React.FC<ListItemProps> = ({ task }) => {
  return (
    <View style={styles.taskContainer}>
      <View style={styles.task}>
        <Text>{task?.title}</Text>
      </View>
    </View>
  );
};

export default SwipeDelete;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  title: {
    fontSize: 40,
    marginVertical: 20,
  },
  taskContainer: {
    width: "100%",
    alignItems: "center",
  },
  task: {
    width: "90%",
    height: 50,
    backgroundColor: "white",
    marginVertical: 10,
    justifyContent : 'center',
    padding : 12,
    shadowOpacity : 1,
    shadowOffset : {  height : 20 , width : 0 }    ,
    elevation : 5,
  },
});
