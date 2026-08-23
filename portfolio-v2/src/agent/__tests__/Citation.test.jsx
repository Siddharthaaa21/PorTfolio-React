import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Citation from '../Citation.jsx';

describe('Citation component', () => {
  it('renders citation chip with source label', () => {
    render(<Citation factId="f-llm-40" label="Infosys · resume" />);
    expect(screen.getByText('Infosys · resume')).toBeInTheDocument();
  });

  it('renders anchor linking to #fact-<id>', () => {
    render(<Citation factId="f-llm-40" label="Infosys · resume" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#fact-f-llm-40');
  });

  it('calls onSelect if provided when clicked', () => {
    const onSelect = vi.fn();
    render(<Citation factId="f-llm-40" label="Infosys · resume" onSelect={onSelect} />);
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(onSelect).toHaveBeenCalledWith('f-llm-40');
  });

  it('scrolls to targeted element when clicked if onSelect is not provided', () => {
    const targetEl = document.createElement('li');
    targetEl.id = 'fact-f-llm-40';
    targetEl.scrollIntoView = vi.fn();
    document.body.appendChild(targetEl);

    render(<Citation factId="f-llm-40" label="Infosys · resume" />);
    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(targetEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    document.body.removeChild(targetEl);
  });
});
