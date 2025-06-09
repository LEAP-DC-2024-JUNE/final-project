"use client";

interface EnrollmentTableProps {
  payments: {
    id: string;
    amount: number;
    stripeId: string;
    createdAt: string;
    course: {
      id: string;
      title: string;
    };
    instructorName?: string;
    card?: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    } | null;
  }[];
}

export const EnrollmentTable = ({ payments }: EnrollmentTableProps) => {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Course</th>
            <th className="px-6 py-3">Instructor</th>
            <th className="px-6 py-3">Amount Paid</th>
            <th className="px-6 py-3">Card</th>
            <th className="px-6 py-3">Enrolled Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 text-teal-700 font-medium">
                {payment.course.title}
              </td>
              <td className="px-6 py-4">
                {payment.instructorName || "Unknown"}
              </td>
              <td className="px-6 py-4">
                ${(payment.amount / 100).toFixed(2)}
              </td>
              <td className="px-6 py-4">
                {payment.card
                  ? `${payment.card.brand.toUpperCase()} **** ${
                      payment.card.last4
                    } (exp ${payment.card.expMonth}/${payment.card.expYear})`
                  : "Unknown"}
              </td>
              <td className="px-6 py-4">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
