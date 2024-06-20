import React from 'react';

import { render, fireEvent, getByText, getByPlaceholderText, getAllByTestId, waitFor, prettyDOM, findByText, getByAltText, act } from '@testing-library/react';

import axios from "axios";

import Application from 'components/Application';

describe("Application", () => {
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    act(async () => {
      const { container } = render(<Application />);

      await findByText(container, "Archie Cohen");

      const appointments = getAllByTestId(container, "appointment");
      const appointment = appointments[0];

      fireEvent.click(getByAltText(appointment, "Add"));
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" },
      })
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
      fireEvent.click(getByText(appointment, "Save"));

      expect(getByText(appointment, "Saving")).toBeInTheDocument();

      await waitFor(() => expect(queryByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument());

      const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
      expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    });
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    act(async () => {
      const { container } = render(<Application />);
      // 2. Wait until the text "Archie Cohen" is displayed.
      await findByText(container, "Archie Cohen");
      // 3. Click the "Delete" button on the booked appointment.
      const appointment = getAllByTestId(container, "appointment").find((appointment) =>
        queryByText(appointment, "Archie Cohen")
      );
      fireEvent.click(getByText(appointment, "Delete"));
      // 4. Check that the confirmation message is shown.
      expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
      // 5. Click the "Confirm" button on the confirmation.
      fireEvent.click(getByText(appointment, "Confirm"));
      // 6. Check that the element with the text "Deleting" is displayed.
      expect(getByText(appointment, "Deleting")).toBeInTheDocument();
      // 7. Wait until the element with the "Add" button is displayed.
      await findByText(appointment, "Add");
      // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
      const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
      expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    });
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    act(async () => {
      const { container } = render(<Application />);
      await findByText(container, "Archie Cohen");
      const appointment = getAllByTestId(container, "appointment").find((appointment) =>
        queryByText(appointment, "Archie Cohen")
      );
      fireEvent.click(getByText(appointment, "Edit"));
      fireEvent.change(getByPlaceholderText(appointment, "Archie Cohen"), {
        target: { value: "Lydia Miller-Jones" },
      })
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
      fireEvent.click(getByText(appointment, "Save"));
      expect(getByText(appointment, "Saving")).toBeInTheDocument();

      await waitFor(() => expect(queryByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument());

      const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
      expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    })
  });

  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });

  it("shows the save error when failing to save an appointment", async () => {
    act(async () => {
      const { container } = render(<Application />);

      await findByText(container, "Archie Cohen");

      const appointments = getAllByTestId(container, "appointment");
      const appointment = appointments[0];

      fireEvent.click(getByAltText(appointment, "Add"));
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" },
      })
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
      fireEvent.click(getByText(appointment, "Save"));
      
      expect(getByText(appointment, "Saving")).toBeInTheDocument();

      axios.put.mockRejectedValueOnce();

      expect(getByText(appointment, "Error Could not book appointment.")).toBeInTheDocument();
    });
  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    act(async () => {
      const { container } = render(<Application />);
      await findByText(container, "Archie Cohen");
      const appointment = getAllByTestId(container, "appointment").find((appointment) =>
        queryByText(appointment, "Archie Cohen")
      );
      fireEvent.click(getByText(appointment, "Delete"));

      expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
      fireEvent.click(getByText(appointment, "Confirm"));

      expect(getByText(appointment, "Deleting")).toBeInTheDocument();
      axios.put.mockRejectedValueOnce();

      expect(getByText(appointment, "Error Could not cancel appointment.")).toBeInTheDocument();
    });
  });

});