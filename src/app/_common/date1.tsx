"use client";
import moment from "moment";

export function CalculateAge(dateOfBirth: any) {
  const now = moment();
  const birthDate = moment(dateOfBirth, "YYYY-MM-DD");
  const yearsDiff = now.diff(birthDate, "years");
  const monthsDiff = now.diff(birthDate, "months") % 12;
  const daysDiff = now.diff(birthDate, "days") % 30;

  return {
    years: yearsDiff,
    months: monthsDiff,
    days: daysDiff,
  };
}
