import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

type Todo = {
  id: string;
  title: string;
  isDone: boolean;
};

export default function App() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    const trimmedText = todoText.trim();

    if (trimmedText.length === 0) {
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: trimmedText,
      isDone: false,
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
    setTodoText("");
  };

  const toggleTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    );
  };

  const completedTodos = todos.filter((todo) => todo.isDone).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>Dopado</Text>
          <Text style={styles.subtitle}>Mach kleine Aufgaben sichtbar.</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            {completedTodos} von {todos.length} erledigt
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Neue Aufgabe..."
            placeholderTextColor="#8a8a8a"
            value={todoText}
            onChangeText={setTodoText}
            onSubmitEditing={addTodo}
          />

          <Pressable style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Noch keine Aufgaben. Erstelle deine erste Dopado-Karte.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.todoCard}>
              <Pressable
                style={[
                  styles.checkbox,
                  item.isDone && styles.checkboxDone,
                ]}
                onPress={() => toggleTodo(item.id)}
              >
                {item.isDone && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>

              <Pressable
                style={styles.todoTextContainer}
                onPress={() => toggleTodo(item.id)}
              >
                <Text
                  style={[
                    styles.todoTitle,
                    item.isDone && styles.todoTitleDone,
                  ]}
                >
                  {item.title}
                </Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTodo(item.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </Pressable>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  appName: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "800",
  },
  subtitle: {
    color: "#a1a1a1",
    fontSize: 16,
    marginTop: 6,
  },
  progressCard: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
  },
  progressText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 16,
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "700",
    marginTop: -2,
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    color: "#777777",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  checkboxDone: {
    backgroundColor: "#7c3aed",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  todoTitleDone: {
    color: "#777777",
    textDecorationLine: "line-through",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#777777",
    fontSize: 26,
    fontWeight: "500",
  },
});