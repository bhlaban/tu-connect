using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using TUConnect.Mobile.Services;

namespace TUConnect.Mobile.ViewModels;

public partial class MainViewModel : ObservableObject
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private string welcomeMessage = "Welcome to TU Connect";

    [ObservableProperty]
    private int totalMembers;

    [ObservableProperty]
    private bool isLoading;

    public MainViewModel(IApiService apiService)
    {
        _apiService = apiService;
    }

    [RelayCommand]
    private async Task LoadDashboardAsync()
    {
        try
        {
            IsLoading = true;
            var members = await _apiService.GetMembersAsync();
            TotalMembers = members.Count;
        }
        catch (Exception ex)
        {
            // Log error
            WelcomeMessage = $"Error loading data: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }
}
