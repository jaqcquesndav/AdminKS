# Documentation API des Notifications

Cette documentation décrit les endpoints de gestion des notifications disponibles dans l'application Ksuit Admin, mise à jour en avril 2025.

## Base URL

Tous les endpoints commencent par `/notifications`.

## Types de notifications

- `info` : Informations générales
- `success` : Opérations réussies
- `warning` : Avertissements
- `error` : Erreurs
- `security` : Alertes de sécurité
- `payment` : Notifications liées aux paiements
- `subscription` : Notifications liées aux abonnements
- `document` : Notifications liées aux documents

## Endpoints

### 1. Gestion des notifications

#### 1.1. Obtenir toutes les notifications

**Endpoint:** `GET /notifications`

**Description:** Récupère les notifications de l'utilisateur avec pagination et filtrage.

**Paramètres de requête:**
```
limit: number     // Nombre de notifications à récupérer
offset: number    // Décalage pour la pagination
read: boolean     // Filtrer par statut de lecture (true/false)
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "notifications": [
    {
      "id": "string",
      "type": "success",
      "title": "string",
      "message": "string",
      "read": false,
      "timestamp": "2025-04-23T10:30:00Z",
      "metadata": {
        "link": "string",
        "documentId": "string"
      }
    }
  ],
  "unreadCount": 5,
  "totalCount": 25
}
```

**Droits d'accès requis:** Utilisateur authentifié.

#### 1.2. Obtenir le nombre de notifications non lues

**Endpoint:** `GET /notifications/unread-count`

**Description:** Récupère uniquement le nombre de notifications non lues pour l'utilisateur actuel.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "count": 5
}
```

**Droits d'accès requis:** Utilisateur authentifié.

#### 1.3. Marquer une notification comme lue

**Endpoint:** `PUT /notifications/{id}/read`

**Description:** Marque une notification spécifique comme lue.

**Paramètres de chemin:**
```
id: string       // Identifiant unique de la notification
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (204 No Content)**

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "notification_not_found",
  "message": "Notification non trouvée"
}
```

**Droits d'accès requis:** Utilisateur authentifié propriétaire de la notification.

#### 1.4. Marquer toutes les notifications comme lues

**Endpoint:** `PUT /notifications/read-all`

**Description:** Marque toutes les notifications non lues comme lues pour l'utilisateur actuel.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (204 No Content)**

**Droits d'accès requis:** Utilisateur authentifié.

#### 1.5. Supprimer une notification

**Endpoint:** `DELETE /notifications/{id}`

**Description:** Supprime une notification spécifique.

**Paramètres de chemin:**
```
id: string       // Identifiant unique de la notification
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (204 No Content)**

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "notification_not_found",
  "message": "Notification non trouvée"
}
```

**Droits d'accès requis:** Utilisateur authentifié propriétaire de la notification.

#### 1.6. Récupérer les notifications par type

**Endpoint:** `GET /notifications/type/{type}`

**Description:** Récupère les notifications d'un type spécifique.

**Paramètres de chemin:**
```
type: string       // Type de notification (info, success, warning, error, security, payment, subscription, document)
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "notifications": [
    {
      "id": "string",
      "type": "payment",
      "title": "string",
      "message": "string",
      "read": false,
      "timestamp": "2025-04-23T10:30:00Z",
      "metadata": {
        "paymentId": "string"
      }
    }
  ],
  "unreadCount": 2,
  "totalCount": 8
}
```

**Droits d'accès requis:** Utilisateur authentifié.

### 2. Préférences de notification

#### 2.1. Obtenir les préférences de notification

**Endpoint:** `GET /notifications/preferences`

**Description:** Récupère les préférences de notification de l'utilisateur actuel.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "email": true,
  "push": true,
  "sms": false,
  "categories": {
    "security": true,
    "payments": true,
    "documents": true,
    "system": false
  }
}
```

**Droits d'accès requis:** Utilisateur authentifié.

#### 2.2. Mettre à jour les préférences de notification

**Endpoint:** `PUT /notifications/preferences`

**Description:** Met à jour les préférences de notification de l'utilisateur actuel.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "email": true,
  "push": true,
  "sms": true,
  "categories": {
    "security": true,
    "payments": false,
    "documents": true,
    "system": false
  }
}
```

**Réponse réussie (200 OK):**
```json
{
  "email": true,
  "push": true,
  "sms": true,
  "categories": {
    "security": true,
    "payments": false,
    "documents": true,
    "system": false
  }
}
```

**Droits d'accès requis:** Utilisateur authentifié.

## Notifications en temps réel

L'API prend en charge les notifications en temps réel via WebSockets. Les clients peuvent s'abonner pour recevoir des notifications instantanées.

### Format des événements WebSocket

```json
{
  "id": "string",
  "type": "success",
  "title": "string",
  "message": "string",
  "timestamp": "2025-04-23T10:30:00Z",
  "metadata": {
    "link": "string"
  }
}
```

Pour se connecter au WebSocket des notifications:
```
wss://api.example.com/ws/notifications?token={authToken}
```

## Bonnes pratiques pour gérer les notifications

1. **Requêtes périodiques** : Interroger le endpoint `/notifications/unread-count` périodiquement (toutes les 30 secondes à 2 minutes) pour mettre à jour le badge de notification dans l'interface utilisateur.

2. **Gestion des lots** : Marquer les notifications comme lues lorsqu'elles sont affichées à l'utilisateur.

3. **Optimisation mobile** : Sur les appareils mobiles, réduire la fréquence des requêtes pour économiser la batterie et les données.

4. **Erreurs de connexion** : Implémenter une logique de retry exponentielle pour les connexions WebSocket en cas de déconnexion.
