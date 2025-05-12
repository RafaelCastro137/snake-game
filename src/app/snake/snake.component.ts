import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit, OnDestroy {
  // Configurações do jogo
  tileSize = 20;
  gridSize = 20;
  
  // Estado do jogo
  snake: { x: number; y: number }[] = [];
  food = { x: 5, y: 5 };
  direction = 'RIGHT';
  nextDirection = 'RIGHT';
  score = 0;
  gameOver = false;
  gameLoop: any;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    // Inicializa a cobrinha
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    
    this.score = 0;
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.gameOver = false;
    this.placeFood();
    
    // Inicia o loop do jogo (movimento a cada 150ms)
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.move(), 150);
  }

  placeFood() {
    // Posiciona a comida em um lugar aleatório
    this.food = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    };
    
    // Garante que a comida não aparece em cima da cobra
    while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y)) {
      this.food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    }
  }

  move() {
    // Atualiza a direção
    this.direction = this.nextDirection;
    
    // Calcula a nova posição da cabeça
    const head = { ...this.snake[0] };
    
    switch (this.direction) {
      case 'UP': head.y--; break;
      case 'DOWN': head.y++; break;
      case 'LEFT': head.x--; break;
      case 'RIGHT': head.x++; break;
    }
    
    // Verifica colisões (paredes ou corpo)
    if (
      head.x < 0 || head.x >= this.gridSize || 
      head.y < 0 || head.y >= this.gridSize ||
      this.snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      this.gameOver = true;
      clearInterval(this.gameLoop);
      return;
    }
    
    // Adiciona a nova cabeça
    this.snake.unshift(head);
    
    // Verifica se comeu a comida
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      // Remove a cauda se não comeu
      this.snake.pop();
    }
  }

  // Controles por teclado
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp': if (this.direction !== 'DOWN') this.nextDirection = 'UP'; break;
      case 'ArrowDown': if (this.direction !== 'UP') this.nextDirection = 'DOWN'; break;
      case 'ArrowLeft': if (this.direction !== 'RIGHT') this.nextDirection = 'LEFT'; break;
      case 'ArrowRight': if (this.direction !== 'LEFT') this.nextDirection = 'RIGHT'; break;
    }
  }

  // Controles por botões (mobile)
  changeDirection(newDirection: string) {
    if (
      (newDirection === 'UP' && this.direction !== 'DOWN') ||
      (newDirection === 'DOWN' && this.direction !== 'UP') ||
      (newDirection === 'LEFT' && this.direction !== 'RIGHT') ||
      (newDirection === 'RIGHT' && this.direction !== 'LEFT')
    ) {
      this.nextDirection = newDirection;
    }
  }

  ngOnDestroy() {
    if (this.gameLoop) clearInterval(this.gameLoop);
  }
}