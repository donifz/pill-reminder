'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { ClockIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { medicationsApi, Medication } from '@/app/services/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';

export default function MedicationDetails() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: medication, isLoading } = useQuery(['medication', id], () => medicationsApi.getOne(id));

  const toggleMutation = useMutation(medicationsApi.toggleTaken, {
    onSuccess: () => {
      queryClient.invalidateQueries(['medication', id]);
    },
  });

  if (isLoading || !medication) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const days = medication.startDate && medication.endDate
    ? eachDayOfInterval({
        start: new Date(medication.startDate),
        end: new Date(medication.endDate),
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to medications
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{medication.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Dose</h2>
                <p className="text-lg text-gray-900">{medication.dose}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500">Time</h2>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-lg text-gray-900">{medication.time}</p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Duration</h2>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-lg text-gray-900">
                    {format(new Date(medication.startDate), 'MMM d, yyyy')} - {format(new Date(medication.endDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-4">Progress</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {medication.takenDates?.length || 0}/{medication.duration}
                  </p>
                  <p className="text-sm text-gray-500">days completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Calendar</h2>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const isTaken = medication.takenDates?.some(date => 
                isSameDay(new Date(date), day)
              );
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square p-2 rounded-lg flex flex-col items-center justify-center
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    ${isTaken ? 'bg-green-50' : 'bg-gray-50'}`}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {format(day, 'd')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(day, 'MMM')}
                  </span>
                  {isTaken ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-gray-300 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 