using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using TUConnect.Core.Models;
using TUConnect.Mobile.Services;

namespace TUConnect.Mobile.ViewModels;

public partial class FishingLogViewModel : ObservableObject
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private ObservableCollection<FishingLog> fishingLogs = new();

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private FishingLog? selectedLog;

    public FishingLogViewModel(IApiService apiService)
    {
        _apiService = apiService;
    }

    [RelayCommand]
    private async Task LoadLogsAsync()
    {
        try
        {
            IsLoading = true;
            var logs = await _apiService.GetFishingLogsAsync();
            FishingLogs.Clear();
            foreach (var log in logs)
            {
                FishingLogs.Add(log);
            }
        }
        catch (Exception ex)
        {
            // Log error
            await Application.Current!.MainPage!.DisplayAlert("Error", $"Failed to load logs: {ex.Message}", "OK");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task AddLogAsync()
    {
        // Navigate to add log page
        await Shell.Current.DisplayAlert("Add Log", "Add new fishing log", "OK");
    }

    [RelayCommand]
    private async Task DeleteLogAsync(FishingLog log)
    {
        try
        {
            var confirm = await Application.Current!.MainPage!.DisplayAlert(
                "Confirm Delete",
                $"Delete fishing log from {log.FishingDate:d}?",
                "Yes",
                "No");

            if (confirm)
            {
                await _apiService.DeleteFishingLogAsync(log.Id);
                FishingLogs.Remove(log);
            }
        }
        catch (Exception ex)
        {
            await Application.Current!.MainPage!.DisplayAlert("Error", $"Failed to delete log: {ex.Message}", "OK");
        }
    }
}
