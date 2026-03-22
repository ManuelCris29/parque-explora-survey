# 🏛️ Diagrama de Clases - Parque Explora Survey

## 📊 Modelo de Datos y Relaciones

### **Entidades Principales**

```
┌─────────────────────────────────────────────────────────────────┐
│                        SISTEMA DE ENCUESTAS                    │
│                         PARQUE EXPLORA                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      USER       │     │     SURVEY      │     │      ROOM       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ + cedula: PK    │     │ + surveyId: PK  │     │ + roomId: PK    │
│ + nombre        │     │ + cedula: FK    │◄────┤ + nombre        │
│ + email         │     │ + estado        │     │ + descripcion   │
│ + telefono      │     │ + calificacion  │     │ + categoria     │
│ + boletaId      │     │ + salasVisitas  │     │ + activo        │
│ + fechaCompra   │     │ + salasFav      │     └─────────────────┘
│ + timestamps    │     │ + salasRenovar  │
└─────────────────┘     │ + comentarios   │
         │               │ + timestamps    │
         │               └─────────────────┘
         │                        │
         └────────────────────────┘
                  1:N
              (Un usuario puede tener múltiples encuestas)
```

### **Clases de Dominio**

#### **1. User (Usuario/Visitante)**
```typescript
class User {
  // Identificadores
  cedula: string;           // Cédula de ciudadanía (PK)
  boletaId: string;         // ID único de la boleta
  
  // Información personal
  nombre: string;           // Nombre completo
  email: string;            // Correo electrónico
  telefono: string;         // Número de teléfono
  
  // Fechas
  fechaCompra: Date;        // Fecha de compra de la boleta
  fechaCreacion: Date;      // Fecha de registro en el sistema
  fechaActualizacion: Date; // Última actualización
  
  // Métodos
  + validateCedula(): boolean;
  + validateEmail(): boolean;
  + toJSON(): object;
  + fromJSON(data: object): User;
}
```

#### **2. Survey (Encuesta)**
```typescript
class Survey {
  // Identificadores
  surveyId: string;         // ID único de la encuesta (PK)
  cedula: string;           // Cédula del usuario (FK)
  
  // Estado de la encuesta
  estado: SurveyStatus;     // pending | completed
  
  // Calificaciones
  calificacionGeneral: number; // 1-5 estrellas
  
  // Salas visitadas y preferencias
  salasVisitadas: string[];    // Array de IDs de salas visitadas
  salasFavoritas: string[];    // Array de salas favoritas ordenadas
  salasParaRenovar: string[];  // Salas que necesitan renovación
  
  // Comentarios
  comentarios: string;         // Comentarios adicionales
  
  // Fechas
  fechaCreacion: Date;
  fechaActualizacion: Date;
  
  // Métodos
  + isCompleted(): boolean;
  + canBeEdited(): boolean;
  + calculateScore(): number;
  + validate(): boolean;
  + toJSON(): object;
  + fromJSON(data: object): Survey;
}
```

#### **3. Room (Sala)**
```typescript
class Room {
  // Identificadores
  roomId: string;           // ID único de la sala (PK)
  
  // Información de la sala
  nombre: string;           // Nombre de la sala
  descripcion: string;      // Descripción detallada
  categoria: string;        // Categoría (exhibición, interactiva, etc.)
  
  // Estado
  activo: boolean;          // Si la sala está disponible
  
  // Métodos
  + isActive(): boolean;
  + toJSON(): object;
  + fromJSON(data: object): Room;
}
```

### **Enums y Tipos**

#### **SurveyStatus**
```typescript
enum SurveyStatus {
  PENDING = "pending",
  COMPLETED = "completed"
}

type SurveyRating = 1 | 2 | 3 | 4 | 5;
```

### **Clases de Servicio**

#### **1. UserService**
```typescript
class UserService {
  // Operaciones CRUD
  + createUser(user: User): Promise<User>;
  + getUserByCedula(cedula: string): Promise<User | null>;
  + updateUser(cedula: string, data: Partial<User>): Promise<User>;
  + deleteUser(cedula: string): Promise<boolean>;
  + getAllUsers(): Promise<User[]>;
  
  // Validaciones
  + validateUserData(user: User): ValidationResult;
  + checkUserExists(cedula: string): Promise<boolean>;
  
  // Utilidades
  + generateBoletaId(): string;
  + formatCedula(cedula: string): string;
}
```

#### **2. SurveyService**
```typescript
class SurveyService {
  // Operaciones CRUD
  + createSurvey(survey: Survey): Promise<Survey>;
  + getSurveyById(surveyId: string): Promise<Survey | null>;
  + getSurveyByUser(cedula: string): Promise<Survey | null>;
  + updateSurvey(surveyId: string, data: Partial<Survey>): Promise<Survey>;
  + deleteSurvey(surveyId: string): Promise<boolean>;
  + getAllSurveys(): Promise<Survey[]>;
  
  // Lógica de negocio
  + canUserCreateSurvey(cedula: string): Promise<boolean>;
  + markSurveyAsCompleted(surveyId: string): Promise<Survey>;
  + getSurveysByStatus(status: SurveyStatus): Promise<Survey[]>;
  
  // Analytics
  + getSurveyStatistics(): Promise<SurveyStats>;
  + getAverageRating(): Promise<number>;
}
```

#### **3. RoomService**
```typescript
class RoomService {
  // Operaciones CRUD
  + createRoom(room: Room): Promise<Room>;
  + getRoomById(roomId: string): Promise<Room | null>;
  + updateRoom(roomId: string, data: Partial<Room>): Promise<Room>;
  + deleteRoom(roomId: string): Promise<boolean>;
  + getAllRooms(): Promise<Room[]>;
  + getActiveRooms(): Promise<Room[]>;
  
  // Categorías
  + getRoomsByCategory(categoria: string): Promise<Room[]>;
  + getCategories(): Promise<string[]>;
}
```

### **Clases de Controlador (API)**

#### **1. UserController**
```typescript
class UserController {
  + createUser(req: Request, res: Response): Promise<void>;
  + getUserById(req: Request, res: Response): Promise<void>;
  + updateUser(req: Request, res: Response): Promise<void>;
  + deleteUser(req: Request, res: Response): Promise<void>;
  + getAllUsers(req: Request, res: Response): Promise<void>;
  
  // Validación de entrada
  + validateCreateUserInput(data: any): ValidationResult;
  + validateUpdateUserInput(data: any): ValidationResult;
}
```

#### **2. SurveyController**
```typescript
class SurveyController {
  + createSurvey(req: Request, res: Response): Promise<void>;
  + getSurveyById(req: Request, res: Response): Promise<void>;
  + getSurveyByUser(req: Request, res: Response): Promise<void>;
  + updateSurvey(req: Request, res: Response): Promise<void>;
  + deleteSurvey(req: Request, res: Response): Promise<void>;
  + getAllSurveys(req: Request, res: Response): Promise<void>;
  
  // Validación de entrada
  + validateCreateSurveyInput(data: any): ValidationResult;
  + validateUpdateSurveyInput(data: any): ValidationResult;
}
```

### **Clases de Utilidad**

#### **1. ValidationResult**
```typescript
class ValidationResult {
  isValid: boolean;
  errors: string[];
  
  + addError(error: string): void;
  + hasErrors(): boolean;
  + getErrorMessage(): string;
}
```

#### **2. ApiResponse**
```typescript
class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  
  + static success<T>(data: T, message?: string): ApiResponse<T>;
  + static error(message: string, errors?: string[]): ApiResponse<null>;
}
```

### **Clases de Frontend (React)**

#### **1. UserComponent**
```typescript
interface UserComponentProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (cedula: string) => void;
  onView: (user: User) => void;
}

const UserComponent: React.FC<UserComponentProps> = ({ user, onEdit, onDelete, onView }) => {
  // Componente para mostrar información del usuario
};
```

#### **2. SurveyComponent**
```typescript
interface SurveyComponentProps {
  survey: Survey;
  rooms: Room[];
  onSubmit: (survey: Survey) => void;
  onCancel: () => void;
}

const SurveyComponent: React.FC<SurveyComponentProps> = ({ survey, rooms, onSubmit, onCancel }) => {
  // Componente para completar encuestas
};
```

#### **3. AdminPanel**
```typescript
const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'surveys'>('users');
  
  // Lógica del panel de administración
};
```

### **Diagrama de Relaciones**

```
┌─────────────┐    1:N    ┌─────────────┐    M:N     ┌─────────────┐
│    USER     │◄─────────►│   SURVEY    │◄──────────►│    ROOM     │
├─────────────┤           ├─────────────┤            ├─────────────┤
│ cedula (PK) │           │ surveyId(PK)│            │ roomId (PK) │
│ nombre      │           │ cedula (FK) │            │ nombre      │
│ email       │           │ estado      │            │ categoria   │
│ telefono    │           │ rating      │            │ activo      │
│ boletaId    │           │ salasVisitas│            └─────────────┘
│ timestamps  │           │ salasFav    │
└─────────────┘           │ salasRenovar│
                          │ comentarios │
                          │ timestamps  │
                          └─────────────┘
```

### **Patrones de Diseño Implementados**

#### **1. Repository Pattern**
- Separación entre lógica de datos y lógica de negocio
- Interfaces para acceso a datos

#### **2. Service Layer Pattern**
- Lógica de negocio centralizada
- Validaciones y transformaciones

#### **3. DTO (Data Transfer Object)**
- Objetos para transferencia de datos entre capas
- Validación de entrada y salida

#### **4. Factory Pattern**
- Creación de objetos complejos
- Instanciación de servicios

---

## 📝 Notas de Implementación

- **Inmutabilidad**: Los objetos de dominio son inmutables
- **Validación**: Validación en múltiples capas
- **Error Handling**: Manejo consistente de errores
- **Type Safety**: TypeScript para type safety
- **Testing**: Clases diseñadas para ser testeable

---

*Diagrama de clases para el Sistema de Encuestas de Satisfacción - Parque Explora*
