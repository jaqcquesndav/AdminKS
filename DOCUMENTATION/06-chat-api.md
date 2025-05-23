# Documentation API de Chat

Cette documentation décrit les endpoints de chat disponibles dans l'application Ksuit Admin, mise à jour en avril 2025.

## Base URL

Tous les endpoints commencent par `/chat`.

## Types et Statuts

### Types de participants
- `user` : Client ou utilisateur final
- `support` : Agent du support ou administrateur

### Statuts de session
- `active` : Session de chat en cours
- `closed` : Session de chat terminée

### Priorités
- `low` : Priorité basse
- `medium` : Priorité moyenne
- `high` : Priorité élevée

## Endpoints

### 1. Sessions de chat

#### 1.1. Obtenir les sessions de chat

**Endpoint:** `GET /chat/sessions`

**Description:** Récupère la liste des sessions de chat avec pagination et filtrage.

**Paramètres de requête:**
```
status: string     // Filtrer par statut ('active' ou 'closed')
page: number       // Numéro de page (commence à 1)
limit: number      // Nombre de sessions par page
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "sessions": [
    {
      "id": "string",
      "userId": "string",
      "agentId": "string",
      "status": "active",
      "startedAt": "2025-04-20T14:30:00Z",
      "endedAt": null,
      "subject": "string",
      "priority": "medium",
      "tags": ["string"],
      "lastMessage": {
        "content": "string",
        "sender": "user",
        "timestamp": "2025-04-20T14:35:00Z"
      },
      "unreadCount": 3
    }
  ],
  "totalCount": 42
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

#### 1.2. Obtenir une session de chat par ID

**Endpoint:** `GET /chat/sessions/{sessionId}`

**Description:** Récupère les détails d'une session de chat spécifique.

**Paramètres de chemin:**
```
sessionId: string  // Identifiant unique de la session de chat
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "userId": "string",
  "agentId": "string",
  "status": "active",
  "startedAt": "2025-04-20T14:30:00Z",
  "endedAt": null,
  "subject": "string",
  "priority": "medium",
  "tags": ["string"],
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "picture": "string"
  },
  "agent": {
    "id": "string",
    "name": "string",
    "picture": "string"
  }
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "session_not_found",
  "message": "Session de chat non trouvée"
}
```

**Droits d'accès requis:** Utilisateur authentifié participant à la session ou avec rôle "admin" ou "customer_support".

#### 1.3. Créer une nouvelle session de chat

**Endpoint:** `POST /chat/sessions`

**Description:** Crée une nouvelle session de chat.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "subject": "string",
  "priority": "medium",
  "tags": ["string"]
}
```

**Réponse réussie (201 Created):**
```json
{
  "id": "string",
  "userId": "string",
  "status": "active",
  "startedAt": "2025-04-20T14:30:00Z",
  "subject": "string",
  "priority": "medium",
  "tags": ["string"]
}
```

**Droits d'accès requis:** Utilisateur authentifié.

#### 1.4. Fermer une session de chat

**Endpoint:** `PUT /chat/sessions/{sessionId}/close`

**Description:** Ferme une session de chat active.

**Paramètres de chemin:**
```
sessionId: string  // Identifiant unique de la session de chat
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "status": "closed",
  "endedAt": "2025-04-20T15:30:00Z"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "invalid_operation",
  "message": "La session est déjà fermée"
}
```

**Droits d'accès requis:** Utilisateur authentifié participant à la session ou avec rôle "admin" ou "customer_support".

#### 1.5. Attribuer un agent à une session de chat

**Endpoint:** `PUT /chat/sessions/{sessionId}/assign`

**Description:** Attribue un agent du support à une session de chat.

**Paramètres de chemin:**
```
sessionId: string  // Identifiant unique de la session de chat
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "agentId": "string"
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "agentId": "string",
  "agent": {
    "id": "string",
    "name": "string",
    "picture": "string"
  }
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "agent_not_found",
  "message": "Agent non trouvé"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

### 2. Messages

#### 2.1. Obtenir les messages d'une session de chat

**Endpoint:** `GET /chat/sessions/{sessionId}/messages`

**Description:** Récupère les messages d'une session de chat avec pagination.

**Paramètres de chemin:**
```
sessionId: string  // Identifiant unique de la session de chat
```

**Paramètres de requête:**
```
before: string     // ID du message pour la pagination (optionnel)
limit: number      // Nombre de messages à récupérer
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "messages": [
    {
      "id": "string",
      "content": "string",
      "sender": "user",
      "timestamp": "2025-04-20T14:35:00Z",
      "read": true,
      "attachments": [
        {
          "id": "string",
          "url": "string",
          "type": "image/jpeg",
          "name": "string",
          "size": 12345,
          "metadata": {
            "width": 800,
            "height": 600
          }
        }
      ]
    }
  ],
  "totalCount": 15,
  "hasMore": true
}
```

**Droits d'accès requis:** Utilisateur authentifié participant à la session ou avec rôle "admin" ou "customer_support".

#### 2.2. Envoyer un message

**Endpoint:** `POST /chat/sessions/{sessionId}/messages`

**Description:** Envoie un nouveau message dans une session de chat. Peut inclure des pièces jointes qui seront envoyées via FormData.

**Paramètres de chemin:**
```
sessionId: string  // Identifiant unique de la session de chat
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json        // Pour les requêtes sans pièces jointes
Content-Type: multipart/form-data     // Pour les requêtes avec pièces jointes
```

**Requête sans pièces jointes:**
```json
{
  "content": "string"
}
```

**Requête avec pièces jointes:** Utiliser `multipart/form-data` avec:
- `content`: Texte du message
- `attachments[0]`, `attachments[1]`, etc.: Fichiers à joindre

**Réponse réussie (201 Created):**
```json
{
  "id": "string",
  "content": "string",
  "sender": "user",
  "timestamp": "2025-04-20T14:40:00Z",
  "read": false,
  "attachments": [
    {
      "id": "string",
      "url": "string",
      "type": "string",
      "name": "string",
      "size": 12345
    }
  ]
}
```

**Droits d'accès requis:** Utilisateur authentifié participant à la session ou avec rôle "admin" ou "customer_support".

#### 2.3. Télécharger une pièce jointe

**Endpoint:** `GET /chat/attachments/{attachmentId}`

**Description:** Télécharge une pièce jointe spécifique.

**Paramètres de chemin:**
```
attachmentId: string  // Identifiant unique de la pièce jointe
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie:** Le fichier binaire est renvoyé avec l'en-tête Content-Type approprié.

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "attachment_not_found",
  "message": "Pièce jointe non trouvée"
}
```

**Droits d'accès requis:** Utilisateur authentifié participant à la session ou avec rôle "admin" ou "customer_support".

#### 2.4. Marquer des messages comme lus

**Endpoint:** `PUT /chat/sessions/{sessionId}/read`

**Description:** Marque plusieurs messages comme lus.

**Paramètres de chemin:**
```
sessionId: string  // Identifiant unique de la session de chat
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "messageIds": ["string"]
}
```

**Réponse réussie (204 No Content)**

**Droits d'accès requis:** Utilisateur authentifié participant à la session ou avec rôle "admin" ou "customer_support".

### 3. Événements de frappe

#### 3.1. Envoyer un événement de frappe

**Endpoint:** `POST /chat/sessions/{sessionId}/typing`

**Description:** Signale qu'un utilisateur est en train de taper un message.

**Paramètres de chemin:**
```
sessionId: string  // Identifiant unique de la session de chat
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "isTyping": true
}
```

**Réponse réussie (204 No Content)**

**Droits d'accès requis:** Utilisateur authentifié participant à la session ou avec rôle "admin" ou "customer_support".

### 4. Statistiques

#### 4.1. Obtenir les statistiques du chat

**Endpoint:** `GET /chat/stats`

**Description:** Récupère les statistiques générales du chat pour le tableau de bord d'administration.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "totalSessions": 125,
  "activeSessions": 15,
  "averageResponseTime": 120,
  "messagesExchanged": 1540
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

## Notifications en temps réel

L'API prend en charge les notifications en temps réel pour les mises à jour de chat via WebSockets. Les clients peuvent s'abonner pour recevoir des mises à jour instantanées.

### Types d'événements WebSocket

1. **Nouveau message**
```json
{
  "type": "message",
  "data": {
    "id": "string",
    "sessionId": "string",
    "content": "string",
    "sender": "user",
    "timestamp": "2025-04-20T14:45:00Z",
    "attachments": []
  }
}
```

2. **Événement de frappe**
```json
{
  "type": "typing",
  "data": {
    "sessionId": "string",
    "userId": "string",
    "isTyping": true,
    "timestamp": "2025-04-20T14:45:30Z"
  }
}
```

3. **Mise à jour de session**
```json
{
  "type": "session_update",
  "data": {
    "id": "string",
    "status": "closed",
    "agentId": "string"
  }
}
```

Pour se connecter au WebSocket:
```
wss://api.example.com/ws/chat/{sessionId}?token={authToken}
```
