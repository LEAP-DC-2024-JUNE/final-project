"use client";

import { EnrollmentTableProps } from "@/utils/types";

export const EnrollmentTable = ({ payments }: EnrollmentTableProps) => {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3">Course</th>
            <th className="px-6 py-3">Instructor</th>
            <th className="px-6 py-3">Amount Paid</th>
            <th className="px-6 py-3">Card</th>
            <th className="px-6 py-3">Enrolled Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 font-medium text-teal-700">
                {payment.course.title}
              </td>
              <td className="px-6 py-4">
                {payment.instructorName || (
                  <span className="text-gray-400">Unknown</span>
                )}
              </td>
              <td className="px-6 py-4 font-semibold text-green-700">
                ${payment.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                {payment.card ? (
                  <div>
                    <div className="font-medium uppercase">
                      {payment.card.brand} **** {payment.card.last4}
                    </div>
                    <div className="text-xs text-gray-500">
                      Exp: {payment.card.expMonth}/{payment.card.expYear}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Unknown</span>
                )}
              </td>
              <td className="px-6 py-4">
                {new Date(payment.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
