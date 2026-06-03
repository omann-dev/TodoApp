
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TodoCard } from "../components/TodoCard";
import { UseTodosResult } from "../hooks/useTodos";
import { colors } from "../constants/colors";

type HomeScreenProps = {
  todosApi: UseTodosResult;
};

export function HomeScreen({ todosApi }: HomeScreenProps) {
  const [todoText, setTodoText] = useState("");

  async function handleAddTodo() {
    await todosApi.addTodo(todoText);
    setTodoText("");
  }

  return (
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
          {todosApi.completedTodayTodos} von {todosApi.todayTodos.length} heute erledigt
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Neue Aufgabe..."
          placeholderTextColor={colors.textDisabled}
          value={todoText}
          onChangeText={setTodoText}
          onSubmitEditing={handleAddTodo}
        />

        <Pressable style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {todosApi.isLoading ? (
        <Text style={styles.emptyText}>Lade Todos...</Text>
      ) : (
        <FlatList
          data={todosApi.todayTodos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Noch keine Aufgaben für heute.
            </Text>
          }
          renderItem={({ item }) => (
            <TodoCard
              todo={item}
              onToggle={todosApi.toggleTodo}
              onDelete={todosApi.deleteTodo}
            />
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  appName: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 6,
  },
  progressCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
  },
  progressText: {
    color: colors.text,
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
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 16,
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: -2,
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    color: colors.textDisabled,
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});