using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using TUConnect.Core.Models;
using TUConnect.Mobile.Services;

namespace TUConnect.Mobile.ViewModels;

public partial class MemberViewModel : ObservableObject
{
    private readonly IApiService _apiService;

    [ObservableProperty]
    private ObservableCollection<Member> members = new();

    [ObservableProperty]
    private bool isLoading;

    [ObservableProperty]
    private Member? selectedMember;

    public MemberViewModel(IApiService apiService)
    {
        _apiService = apiService;
    }

    [RelayCommand]
    private async Task LoadMembersAsync()
    {
        try
        {
            IsLoading = true;
            var memberList = await _apiService.GetMembersAsync();
            Members.Clear();
            foreach (var member in memberList)
            {
                Members.Add(member);
            }
        }
        catch (Exception ex)
        {
            // Log error
            await Application.Current!.MainPage!.DisplayAlert("Error", $"Failed to load members: {ex.Message}", "OK");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task AddMemberAsync()
    {
        // Navigate to add member page
        await Shell.Current.DisplayAlert("Add Member", "Add new member", "OK");
    }

    [RelayCommand]
    private async Task DeleteMemberAsync(Member member)
    {
        try
        {
            var confirm = await Application.Current!.MainPage!.DisplayAlert(
                "Confirm Delete",
                $"Delete member {member.FirstName} {member.LastName}?",
                "Yes",
                "No");

            if (confirm)
            {
                await _apiService.DeleteMemberAsync(member.Id);
                Members.Remove(member);
            }
        }
        catch (Exception ex)
        {
            await Application.Current!.MainPage!.DisplayAlert("Error", $"Failed to delete member: {ex.Message}", "OK");
        }
    }
}
