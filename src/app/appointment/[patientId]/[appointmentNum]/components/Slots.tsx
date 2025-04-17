import React, { useEffect, useState } from "react";
import {
  getContent,
  isBooked,
  isDateBetween,
} from "./Utils";
import moment from "moment";
import ActionButton from "@/app/_common/button";
import { useParams, useRouter } from "next/navigation";

function Slots({
  slotData,
  currentDate,
  unavailableTimes,
  bookedArray,
  handleClose,
  handleSave,
  selectedSlot,
  handleSlotClick
}: any) {
  const [dates, setDates] = useState([
    currentDate,
    moment(currentDate).add(1, "days").format("YYYY/MM/DD"),
    moment(currentDate).add(2, "days").format("YYYY/MM/DD"),
    moment(currentDate).add(3, "days").format("YYYY/MM/DD"),
    moment(currentDate).add(4, "days").format("YYYY/MM/DD"),
  ]);
  const { appointmentNum } = useParams();
  const router = useRouter();
  const truncateName = (name: string) => {
    return name.length>13?name.substring(0, 13) + "...":name;
  };
  
  return (
    <div>
      {/* <h2 className="text-center font-bold mb-4">Select a Time Slot</h2> */}
      <div className="w-full border border-gray-300">
        <table className="w-full border-collapse border border-gray-300 text-center table-fixed">
          {/* Static Table Header */}
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border p-2 w-[100px]">Slot Time</th>
              {dates.map((date) => (
                <th key={date} className="border p-2 w-[150px]">
                  {moment(date).format("MMMM-D")}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        {/* Scrollable slot cells */}
        <div className="max-h-[250px] overflow-y-scroll hide-scrollbar ">
          <table className="w-full border-collapse border border-gray-300 text-center table-fixed">
            <tbody>
              {slotData.map((time: any) => (
                <tr key={time}>
                  <td className="border font-semibold text-blue-gray-700 h-[60px] w-[100px]">
                    {time}
                  </td>{" "}
                  {dates.map((date) => (
                    <td
                      key={`${date}-${time}`}
                      className={`border p-2 w-[150px] cursor-pointer 
                      ${
                        selectedSlot?.date === date &&
                        selectedSlot?.time === time &&
                        !isBooked(bookedArray, date, time) // Prevent green for booked slots
                          ? "bg-green-300"
                          : "hover:bg-gray-200"
                      } ${
                        isBooked(bookedArray, date, time) &&
                        isBooked(bookedArray, date, time).appointmentNumber ==
                          appointmentNum
                          ? "!bg-yellow-300"
                          : ""
                      }
                    `}
                      onClick={() =>
                        isBooked(bookedArray, date, time)
                          ? null // Prevent booking selection if already booked
                          : handleSlotClick(date, time)
                      }
                    >
                      {selectedSlot?.date === date &&
                      selectedSlot?.time === time ? (
                        isBooked(bookedArray, date, time) ? (
                          ""
                        ) : (
                          "✅"
                        )
                      ) : isDateBetween(date, time, unavailableTimes) ? (
                        <div className="bg-gray-200">Not Available</div>
                      ) : isBooked(bookedArray, date, time) == null ? (
                        ""
                      ) : (
                        <div className="flex flex-col !h-[50px] gap-1 text-[12px] group-hover:bg-gray-200">
                          <div className="flex gap-1 justify-around text-gray-800 group-hover:text-gray-600">
                            {getContent(
                              {
                                name: truncateName(
                                  isBooked(bookedArray, date, time).firstName +
                                    " " +
                                    isBooked(bookedArray, date, time)
                                      .middleName +
                                    " " +
                                    isBooked(bookedArray, date, time).lastName
                                ),
                                apt: isBooked(bookedArray, date, time)
                                  .appointmentNumber,
                                MRN: isBooked(bookedArray, date, time).mrn,
                              },
                              router
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* {selectedSlot && (
        <h3 className="mt-4 text-center font-bold">
          Selected Slot: {selectedSlot.date} at {selectedSlot.time}
        </h3>
      )} */}
      <div className="flex justify-end gap-6 mt-4">
        <ActionButton
          buttonText={"Save"}
          handleSubmit={handleSave}
          disabled={!selectedSlot.time&&!selectedSlot.date}
          width="w-[120px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
        <ActionButton
          buttonText="Cancel"
          width="w-[120px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          handleSubmit={handleClose}
        />
      </div>
    </div>
  );
}

export default Slots;
