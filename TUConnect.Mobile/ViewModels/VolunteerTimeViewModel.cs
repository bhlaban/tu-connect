using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using TUConnect.Core.Models;
using TUConnect.Mobile.Services;

namespace TUConnect.Mobile.ViewModels;

public partial class VolunteerTimeViewModel : ObservableObject
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private ObservableCollection<VolunteerTimeEntry> volunteerTimeEntries = new();

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private VolunteerTimeEntry? selectedEntry;

    public VolunteerTimeViewModel(IApiService apiService)
    {
        _apiService = apiService;
    }

    [RelayCommand]
    private async Task LoadEntriesAsync()
    {
        try
        {
            IsLoading = true;
            var entries = await _apiService.GetVolunteerTimeEntriesAsync();
            VolunteerTimeEntries.Clear();
            foreach (var entry in entries)
            {
                VolunteerTimeEntries.Add(entry);
            }
        }
        catch (Exception ex)
        {
            // Log error
            await Application.Current!.MainPage!.DisplayAlert("Error", $"Failed to load entries: {ex.Message}", "OK");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task AddEntryAsync()
    {
        // Navigate to add entry page
        await Shell.Current.DisplayAlert("Add Entry", "Add new volunteer time entry", "OK");
    }

    [RelayCommand]
    private async Task DeleteEntryAsync(VolunteerTimeEntry entry)
    {
        try
        {
            var confirm = await Application.Current!.MainPage!.DisplayAlert(
                "Confirm Delete",
                $"Delete entry for {entry.EventName}?",
                "Yes",
                "No");

            if (confirm)
            {
                await _apiService.DeleteVolunteerTimeEntryAsync(entry.Id);
                VolunteerTimeEntries.Remove(entry);
            }
        }
        catch (Exception ex)
        {
            await Application.Current!.MainPage!.DisplayAlert("Error", $"Failed to delete entry: {ex.Message}", "OK");
        }
    }
}
