import { CheckCircleIcon, ClockIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface MedicationCardProps {
  id: string;
  name: string;
  dose: string;
  times: string[];
  taken: boolean;
  onTake: () => void;
  onDelete: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  isGuardian?: boolean;
}

export const MedicationCard = ({
  id,
  name,
  dose,
  times,
  taken,
  onTake,
  onDelete,
  user,
  isGuardian,
}: MedicationCardProps) => {
  const bgColor = taken ? 'bg-blue-50' : 'bg-white';
  const borderColor = taken ? 'border-blue-200' : 'border-gray-200';

  // Format time string (assuming format "HH:mm")
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className={`p-4 rounded-xl border ${borderColor} ${bgColor} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <Link href={`/medications/${id}`} className="flex-1">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">{name}</h3>
              {user && (
                <div className="flex items-center text-sm text-gray-500">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{user.name}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{dose}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {times.map((time, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{formatTime(time)}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={onTake}
            className={`p-2 rounded-full ${
              taken ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={isGuardian ? "Mark as taken" : "Take medication"}
          >
            <CheckCircleIcon className="h-6 w-6" />
          </button>
          {!isGuardian && (
            <button
              onClick={onDelete}
              className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
              title="Delete medication"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 