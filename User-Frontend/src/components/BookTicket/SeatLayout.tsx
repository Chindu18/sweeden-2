// import React from "react";

// interface Props {
//   seatLayoutSets: number[][]; // each array represents how many seats per row
//   bookedSeats: number[];
//   selectedSeats: { seat: number; row: number }[];
//   onSeatClick: (seatNumber: number, rowNumber: number) => void;
// }

// const SeatLayout: React.FC<Props> = ({
//   seatLayoutSets,
//   bookedSeats,
//   selectedSeats,
//   onSeatClick,
// }) => {
//   let seatCounter = 1; // continuous seat numbering

//   return (
//     <div className="flex flex-col items-center gap-4">
//       {/* Screen Indicator */}
//       <div className="mb-8 text-center">
//         <div className="bg-gradient-to-r from-transparent via-blue-500 to-transparent h-1 rounded-full mb-2 shadow-lg" />
//         <p className="text-sm sm:text-base font-semibold text-gray-300">
//           SCREEN THIS SIDE
//         </p>
//       </div>

//       {/* Seat Layout */}
//       <div className="space-y-4">
//         {seatLayoutSets.map((row, rowIndex) => {
//           const totalSeatsInRow = row[0]; // 👈 get seat count from first element
//           return (
//             <div
//               key={rowIndex}
//               className="flex justify-center items-center gap-2 sm:gap-3"
//             >
//               {/* Row number left */}
//               <span className="text-xs sm:text-sm text-gray-400 font-bold w-5 sm:w-6 text-right">
//                 {rowIndex + 1}
//               </span>

//               {Array.from({ length: totalSeatsInRow }).map((_, seatIdx) => {
//                 const seatNumber = seatCounter++;
//                 const isBooked = bookedSeats.includes(seatNumber);
//                 const isSelected = selectedSeats.some(
//                   (s) => s.seat === seatNumber
//                 );

//                 const seatColor = isBooked
//                   ? "bg-red-500 cursor-not-allowed"
//                   : isSelected
//                   ? "bg-green-500"
//                   : "bg-gray-300 hover:bg-gray-400";

//                 return (
//                   <button
//                     key={seatNumber}
//                     onClick={() => onSeatClick(seatNumber, rowIndex + 1)}
//                     disabled={isBooked}
//                     className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[10px] sm:text-[12px] font-bold text-white ${seatColor} transition-all duration-200 transform ${
//                       isSelected ? "scale-110" : "scale-100"
//                     }`}
//                   >
//                     {seatNumber}
//                   </button>
//                 );
//               })}

//               {/* Row number right */}
//               <span className="text-xs sm:text-sm text-gray-400 font-bold w-5 sm:w-6 text-left">
//                 {rowIndex + 1}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* Legend */}
//       <div className="flex space-x-4 mt-8 text-xs sm:text-sm text-gray-300">
//         <div className="flex items-center space-x-1">
//           <div className="w-4 h-4 bg-gray-300 rounded-sm border" />
//           <span>Available</span>
//         </div>
//         <div className="flex items-center space-x-1">
//           <div className="w-4 h-4 bg-green-500 rounded-sm border" />
//           <span>Selected</span>
//         </div>
//         <div className="flex items-center space-x-1">
//           <div className="w-4 h-4 bg-red-500 rounded-sm border" />
//           <span>Booked</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatLayout;
import React from "react";

interface Props {
  seatLayoutSets: number[][]; // each array represents how many seats per row
  bookedSeats: number[];
  selectedSeats: { seat: number; row: number }[];
  onSeatClick: (seatNumber: number, rowNumber: number) => void;
}

const SeatLayout: React.FC<Props> = ({
  seatLayoutSets,
  bookedSeats,
  selectedSeats,
  onSeatClick,
}) => {
  let seatCounter = 1; // continuous seat numbering

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Screen Indicator */}
      
      {/* Scrollable Seat Layout */}
      <div className="w-full overflow-x-auto">
        <div className="inline-flex flex-col items-center gap-3 px-4 min-w-max">
          {seatLayoutSets.map((row, rowIndex) => {
            const totalSeatsInRow = row[0];
            return (
              <div
                key={rowIndex}
                className="flex justify-center items-center gap-1.5 sm:gap-2"
              >
                {/* Row number left */}
                <span className="text-xs sm:text-sm text-gray-400 font-bold w-5 sm:w-6 text-right">
                  {rowIndex + 1}
                </span>

                {Array.from({ length: totalSeatsInRow }).map((_, seatIdx) => {
                  const seatNumber = seatCounter++;
                  const isBooked = bookedSeats.includes(seatNumber);
                  const isSelected = selectedSeats.some(
                    (s) => s.seat === seatNumber
                  );

                  const seatColor = isBooked
                    ? "bg-red-500 cursor-not-allowed"
                    : isSelected
                    ? "bg-green-500"
                    : "bg-gray-300 hover:bg-gray-400";

                  return (
                    <button
                      key={seatNumber}
                      onClick={() => onSeatClick(seatNumber, rowIndex + 1)}
                      disabled={isBooked}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[10px] sm:text-[12px] font-bold text-white ${seatColor} transition-all duration-200 transform ${
                        isSelected ? "scale-110" : "scale-100"
                      }`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}

                {/* Row number right */}
                <span className="text-xs sm:text-sm text-gray-400 font-bold w-5 sm:w-6 text-left">
                  {rowIndex + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex space-x-4 mt-8 text-xs sm:text-sm text-gray-300">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-300 rounded-sm border" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-green-500 rounded-sm border" />
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-red-500 rounded-sm border" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
