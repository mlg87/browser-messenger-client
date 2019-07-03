import { action, observable } from 'mobx';
import { Api } from '../services';

export class Messages {

    //
    // ─── OBSERVABLES ────────────────────────────────────────────────────────────────
    //

    @observable conversationId?: number;
    @observable conversations: any[] = []; // TODO: type this
    @observable messages: any[] = []; // TODO: type this

    //
    // ─── ACTIONS ────────────────────────────────────────────────────────────────────
    //

    @action createConversation = async (selectedUserId: number) => {

        try {

            const res = await Api.post('/conversations', { selectedUserId });

            if (!res.ok) {

                const message = res.data && res.data.message;
                throw Error(message || 'Error creating conversation.');

            }

            this.conversations.push(res.data.conversation);
            this.conversationId = res.data.conversation.id;

        } catch (error) {

            return Promise.reject(error.message);

        }

    }

    @action getMessagesForConversation = async () => {

        try {

            // REVIEW: perhaps drop the messages
            const res = await Api.get(`/conversations/${this.conversationId}/messages`, null);

            if (!res.ok) {

                const message = res.data && res.data.message;
                throw Error(message || 'Error fetching messages for conversation.');

            }

            this.messages = res.data.messages;

        } catch (error) {

            return Promise.reject(error.message);

        }

    }

    @action fetchConversations = async () => {

        try {

            const res = await Api.get('/conversations', null);

            if (!res.ok) {

                const message = res.data && res.data.message;
                throw Error(message || 'Error fetching conversations.');

            }

            this.conversations = res.data.conversations;

        } catch (error) {

            this.conversations = [];
            return Promise.reject(error.message);

        }

    }

}

export default new Messages();
