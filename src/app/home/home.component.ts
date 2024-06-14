import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Todo {
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  todos: Todo[] = [];
  todoForm: FormGroup;

  constructor(private fb: FormBuilder,
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router) {

    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isCompleted: [false, Validators.required] // Default status is false (pending)
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo(): void {
    if (this.todoForm.valid) {
      const newTodo: Todo = {
        ...this.todoForm.value,
        isCompleted: this.todoForm.value.isCompleted === 'true'
      };
      console.log('New Todo:', newTodo);
  
      this.todoService.addTodo(newTodo).subscribe({
        next: (todo) => {
          if (todo) { // Ensure todo is not undefined
            console.log('Returned Todo from service:', todo);
            this.todos.push(todo);
            console.log('Todos array after push:', this.todos);
  
            this.todoForm.reset({ isCompleted: false });
            console.log('Todos array after form reset:', this.todos);
          } else {
            console.error('No todo returned from the service');
          }
        },
        error: (error) => {
          console.error('Error adding todo:', error);
        },
        complete: () => {
          console.log('Final Todos array:', this.todos);
        }
      });
    } else {
      console.log('Final Todos array:', this.todos);
    }
  }
  
  
  

  updateTodoStatus(todo: Todo, isCompleted: boolean): void {
    if (todo.id !== undefined) {
      this.todoService.updateTodoStatus(todo.id, isCompleted).subscribe(() => {
        // Update the local status after a successful update
        todo.isCompleted = isCompleted;
      });
    }
  }

  deleteTodo(id?: number): void {
    if (id !== undefined) {
      this.todoService.deleteTodo(id).subscribe(() => {
        this.todos = this.todos.filter(todo => todo.id !== id);
      });
    }
  }

  onLogOut(): void {
    this.authService.userLogout();
    this.router.navigate(['/login'])
  }
}
 