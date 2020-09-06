import React, { Component } from 'react';
import { StyleSheet, Text, Platform, FlatList, Image, ActivityIndicator, View } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true }, this.getData)
  }
  getData = async () => {
    const url = 'https://jsonplaceholder.typicode.com/photos?_limit=10&_page=' + this.state.page
    await fetch(url)
      .then((response) => response.json())
      .then((responseJson) =>
        this.setState({
          data: this.state.data.concat(responseJson),
          isLoading: false
        }),
        console.log("Data", this.state.data)
      )
      .catch(e => console.log(e))
  }
  renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Image style={styles.itemImage} source={{ uri: item.url }} />
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={styles.itemText}>{item.id}</Text>
      </View>
    )
  }
  handleLoadMore = () => {
    console.log("handleLoadMore", this.state.page)
    this.setState({
      page: this.state.page + 1,
      isLoading: true
    }, this.getData)
  }
  renderFooter = () => {
    return (
      this.state.isLoading ?
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color='red'
          />
        </View>
        :
        null
    )
  }
  render() {
    return (
      <FlatList style={styles.container}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.2}
        ListFooterComponent={this.renderFooter}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: '#fff',
  },
  item: { borderBottomColor: '#ccc', marginBottom: 10, borderBottomWidth: 1 },
  itemText: { fontSize: 16, padding: 5 },
  itemImage: { width: '100%', height: 200, resizeMode: "cover" },
  loader: { margin: 10, alignItems: 'center', justifyContent: 'center' }
});
