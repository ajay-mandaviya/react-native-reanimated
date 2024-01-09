import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { Skeleton } from "moti/skeleton";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

type ContactInfo = {
  name: string;
  email: string;
};

const AnimatedSkeleton = () => {
  const [contacts, setCOntacts] = React.useState<ContactInfo[]>([]);

  const fetchContacts = useCallback(async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    setCOntacts(data);
  }, []);

  React.useEffect(() => {
    fetchContacts();
  }, []);
  return (
    <View style={styles.screen}>
      <FlatList
        data={contacts}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{ width: "100%", height: 1, backgroundColor: "#CED0CE" }}
            />
          );
        }}
        renderItem={({ item }) => {
          return <ContactListItem contact={item} />;
        }}
      />
    </View>
  );
};

type ListItemProps = { contact: ContactInfo };

const SkeletonCommonProps = {
  colorMode: "light",
  transition: { type: "timing", duration: 1000 },
  backgroundColor: "#D4D4D4",
} as const;

const ContactListItem: React.FC<ListItemProps> = ({ contact }) => {
  return (
    <View style={styles.itemContainer}>
      <Skeleton.Group show>
        <Skeleton
          height={70}
          width={70}
          radius={"round"}
          {...SkeletonCommonProps}
        >
          <Animated.View
            style={styles.iconVIew}
            entering={FadeIn.duration(1500)}
            layout={Layout}
          >
            <Text style={{ fontSize: 25, color: "white" }}>
              {contact.name?.[0]}
            </Text>
          </Animated.View>
        </Skeleton>
        <View>
          <Skeleton height={25} width={"80%"} {...SkeletonCommonProps}>
            <Text style={{ fontSize: 25 }}>{contact.name}</Text>
          </Skeleton>
          <View style={{ height: 5 }} />
          <Skeleton height={25} width={"70%"} {...SkeletonCommonProps}>
            <Text style={{ fontSize: 25 }}>{contact.email}</Text>
          </Skeleton>
        </View>
      </Skeleton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  itemContainer: {
    width: "100%",
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconVIew: {
    height: 70,
    aspectRatio: 1,
    backgroundColor: "#005CB7",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AnimatedSkeleton;
