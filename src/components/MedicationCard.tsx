import { CheckCircleIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface MedicationCardProps {
  id: string;
  name: string;
  dose: string;
  time: string;
  taken: boolean;
  onTake: () => void;
  onDelete: () => void;
}

export const MedicationCard = ({
  id,
  name,
  dose,
  time,
  taken,
  onTake,
  onDelete,
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
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">{name}</h3>
            <p className="text-sm text-gray-500">{dose}</p>
            <div className="flex items-center mt-2">
              <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">{formatTime(time)}</span>
            </div>
          </div>
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={onTake}
            className={`p-2 rounded-full ${
              taken ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <CheckCircleIcon className="h-6 w-6" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}; 