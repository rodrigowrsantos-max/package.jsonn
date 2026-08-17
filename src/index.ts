import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

// Banco de dados em memória para simulação
let tasks: Task[] = [
  {
    id: 1,
    title: 'Integrar rotas da API',
    description: 'Criar endpoints de CRUD com TypeScript',
    completed: true,
    createdAt: new Date()
  },
  {
    id: 2,
    title: 'Conectar ao PostgreSQL',
    description: 'Configurar pool de conexões e migrations',
    completed: false,
    createdAt: new Date()
  }
];

// Rota de Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// GET /tasks - Listar todas as tarefas
app.get('/tasks', (req: Request, res: Response) => {
  res.json({ success: true, count: tasks.length, data: tasks });
});

// GET /tasks/:id - Buscar por ID
app.get('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ success: false, error: 'Tarefa não encontrada.' });
  }

  res.json({ success: true, data: task });
});

// POST /tasks - Criar tarefa
app.post('/tasks', (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: 'O título é obrigatório.' });
  }

  const newTask: Task = {
    id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

// PUT /tasks/:id - Atualizar tarefa
app.put('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Tarefa não encontrada.' });
  }

  const { title, description, completed } = req.body;

  tasks[index] = {
    ...tasks[index],
    title: title ?? tasks[index].title,
    description: description ?? tasks[index].description,
    completed: completed ?? tasks[index].completed
  };

  res.json({ success: true, data: tasks[index] });
});

// DELETE /tasks/:id - Remover tarefa
app.delete('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Tarefa não encontrada.' });
  }

  tasks.splice(index, 1);
  res.json({ success: true, message: 'Tarefa removida com sucesso.' });
});

app.listen(PORT, () => {
  console.log(`[server]: API rodando na porta ${PORT}`);
});
