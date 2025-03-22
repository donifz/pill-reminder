import { useState } from 'react';
import { addDays } from 'date-fns';

interface AddMedicationFormProps {
  onSubmit: (data: {
    name: string;
    dose: string;
    time: string;
    duration: number;
    startDate: string;
    endDate: string;
  }) => void;
}

export const AddMedicationForm = ({ onSubmit }: AddMedicationFormProps) => {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('09:30');
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = addDays(start, duration - 1);
    
    onSubmit({
      name,
      dose,
      time,
      duration,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });

    setName('');
    setDose('');
    setTime('09:30');
    setDuration(7);
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
          Pill Name
        </label>
        <div className="relative">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm transition-all duration-200 
            focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
            placeholder:text-gray-400"
            placeholder="Enter medication name"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="dose" className="block text-sm font-semibold text-gray-700">
          Dose
        </label>
        <div className="relative">
          <input
            type="text"
            id="dose"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="e.g. 500mg"
            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm transition-all duration-200 
            focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
            placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="time" className="block text-sm font-semibold text-gray-700">
            Time
          </label>
          <div className="relative">
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm transition-all duration-200 
              focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none appearance-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="startDate"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm transition-all duration-200 
              focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="duration" className="block text-sm font-semibold text-gray-700">
          Duration (days)
        </label>
        <div className="relative">
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="1"
            max="30"
            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm transition-all duration-200 
            focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          End date will be: {addDays(new Date(startDate), duration - 1).toLocaleDateString()}
        </p>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        transition-all duration-200 hover:shadow-md"
      >
        Save Medication
      </button>
    </form>
  );
}; 