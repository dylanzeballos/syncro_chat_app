import { EmptyChatIcon } from '../../../components/icons';

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 text-text-muted opacity-60">
        <EmptyChatIcon className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium text-text mb-2">Bienvenido a Syncro Chat</h3>
      <p className="text-text-muted">Selecciona una sala para comenzar a chatear</p>
    </div>
  </div>
);

export default EmptyState;
